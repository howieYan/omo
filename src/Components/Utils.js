import React, {Component} from 'react';
import {Text, View, Platform, Dimensions, PixelRatio, Animated} from 'react-native';
import axios from 'axios';
import moment from 'moment';
//  1、feach
//  2、获取屏幕的高度
//  3、获取最小线宽
export default  {
    size: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        os: Platform.OS,
        // url: 'http://control.omo.services'
        url: 'https://www.contract.omo.news'
    },
    formatTs (ts, format = 'YYYY-MM-DD HH:mm') {
        let time = moment.unix(ts);
        let retVal = time.format(format);
        // debug && console.debug(`${ts} => ${retVal}(${time.format()})`)
        return retVal;
    },
    pixel: 1 / PixelRatio.get(),
    fontScale: PixelRatio.getFontScale(),
    setSpText(size) {
        let scale = Math.min(this.size.height / this.size.height,  this.size.width / this.size.width);
        size = Math.round((size * scale + 0.5) * PixelRatio.get() / PixelRatio.getFontScale());
        return size / PixelRatio.get();
    },
    postJSON (url, params, callback) {
        return new Promise((resolve, reject) => {
            try {
                axios({
                    method: 'POST',
                    url: url,
                    data: params,
                    params: params,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
                    .then(response => {
                        resolve(response.data);
                    })
                    .catch((error) => {
                        console.error(error);
                        reject(new Error('通讯异常，请检查网络或稍后重试。'));
                    });
            }
            catch (e) {
                console.error(`Exception: ${e}`);
                reject(e);
            }
        });
    },
    getJson (url, params) {
        return new Promise((resolve, reject) => {
            try {
                axios({
                    method: 'GET',
                    url: url,
                    data: params,
                    params: params
                })
                    .then(response => {
                        resolve(response.data);
                    })
                    .catch((error) => {
                        console.error(error);
                        reject(new Error('通讯异常，请检查网络或稍后重试。'));
                    });
            }
            catch (e) {
                console.error(`Exception: ${e}`);
                reject(e);
            }
        });
    },
    uploadImage(imageUri, imageName, UserId) {
        return new Promise((resolve, reject) => {
            let data = new FormData()
            if (imageUri) {
                data.append('image', { uri: imageUri, name: imageName, type: 'image/jpg' })//加入图片
                data.append('user_id', UserId)//加入图片
            }
            const config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: data,
            }
            fetch(this.size.url + '/v1/contract/setAvatar', config)
                .then(function (response) {
                    return response.json();
                }).then((responseData) => {
                console.log('responseData', responseData);
                resolve(responseData)
            }).catch((error) => {
                return reject(error);
            });
        });
    }
}
