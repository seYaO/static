/**
 * 上传静态文件资源
 */
'use strict'

const fs = require('fs')
const path = require('path')
const glob = require('glob')
const Bagpipe = require('bagpipe')
const fetch = require('node-fetch')
const FormData = require('form-data')
const config = require('./uploadpc.config')
const routeInfos = require('./pc.config')

const routeInfo = routeInfos[routeInfos.length - 1]

console.log(process.argv.splice(2))

/**
 * 上传静态资源
 * @param {*} file 
 * @param {*} callback 
 */
function uploadFile(file, type, callback) {
    let reg = /(.*?)[0-9a-zA-Z-~\.]*?\.(css|js|jpg|jpeg|png|bmp|webp|gif|map)$/
    let url = config.uploadfileAddress;
    let bucketName = type == 'css' ? config.bucketNameCss : config.bucketNameJs
    // let subpath = path.relative('public', file).replace(/\\/g, '/');
    // subpath = `/${subpath.replace(reg, '$1')}`;
    let headers = {
        'user-token': config['user-token'],
        'asset-key': config['asset-key']
    }
    let form = new FormData();
    form.append('bucket_name', bucketName);
    form.append('key', `${config.projectName}/${routeInfo.version}/`);
    form.append('file', fs.createReadStream(file));
    // console.log(subpath, routeInfo.version)
    // console.log(form)
    // console.log(`${type}===================`)

    // return fetch(url, {
    //     method: 'post',
    //     headers: headers,
    //     body: form
    // }).then(function (res) {
    //     if (res.status == 200) {
    //         return res.json();
    //     } else {
    //         // console.log(res.status)
    //         return res.json();
    //     }

    // }).then(function (data) {
    //     callback.call(null, null, data);
    // }).catch(function (e) {
    //     callback.call(null, new Error(file + ' upload error'));
    // })
}

/**
 * 部署静态资源
 */
function deployAssets() {
    return new Promise((res, rej) => {
        glob(`public/${routeInfo.name}/*.css`, { nodir: true }, (error, files) => {
            const bagpipe = new Bagpipe(50);
            let failed = [];
            files.forEach(file => {
                bagpipe.push(uploadFile, file, 'css', (err, data) => {
                    if (err || data.code !== 0) {
                        failed.push(err.toString())
                    }
                    if (bagpipe.active === 0) {
                        if (failed && failed[0]) {
                            rej(failed)
                        } else {
                            res('静态资源上传成功')
                        }
                    }
                })
            });
        })
        glob(`public/${routeInfo.name}/*.js`, { nodir: true }, (error, files) => {
            const bagpipe = new Bagpipe(50);
            let failed = [];
            files.forEach(file => {
                bagpipe.push(uploadFile, file, 'js', (err, data) => {
                    if (err || data.code !== 0) {
                        failed.push(err.toString())
                    }
                    if (bagpipe.active === 0) {
                        if (failed && failed[0]) {
                            rej(failed)
                        } else {
                            res('静态资源上传成功')
                        }
                    }
                })
            });
        })
    })
}

// 部署静态资源
const upload = async () => {
    try {
        console.log('开始处理上传...')
        let tip = await deployAssets();
        console.log(tip);
    } catch (err) {
        err.message += `\n 上传失败，请重新上传一次...`;
        console.log(err)
    }
}

upload();