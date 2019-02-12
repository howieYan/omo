import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    AsyncStorage,
} from 'react-native';
import Utils from "../../Components/Utils";
import {Loading} from "../../Components/Loading";
import ImagePicker from 'react-native-image-picker';
export default class Photo extends React.Component {
    static navigationOptions = ({navigation}) => (
        console.log(navigation),{
        headerTitle: navigation.state.params.name,
        headerTintColor: '#fff',
        headerTitleStyle:{
            flex:1,
            textAlign: 'center',
        },
        headerStyle: {
            backgroundColor: '#000',
            borderBottomWidth: 0,
        },
        headerRight: <View/>,
    })
    constructor(props) {
        super(props);
        this.state = {
            avatar: '',
            data: {},
            language: {},
        };
    }
    componentDidMount () {
        this.loadData();
    }
    onBackButton () {
        this.props.navigation.state.params.ReCodeLoadData();
        this.props.navigation.goBack()
    }
    async loadData () {
        try {
            let resulta = await AsyncStorage.getItem('language');
            this.setState({
                language: JSON.parse(resulta),
            })
            let lang = await  AsyncStorage.getItem('lang');
            let UserId = await AsyncStorage.getItem('UserId');
            let formData = new FormData();
            formData.append('user_id', UserId);
            formData.append('lang', lang);
            let data = await Utils.postJSON(Utils.size.url + '/v1/contract/getInfo', formData);
            if (Number(data.code) === 0) {
                this.setState({
                    data: data.result,
                    avatar: data.result.avatar
                })
            }
            this.props.navigation.setParams(this.onBackButton.bind(this));
        }
        catch (e) {
            console.log(e)
        }
    }
    render() {
        return (
            <View style={styles.content}>
                <View style={[styles.content,styles.contentBg]}>
                    <View style={styles.photoMain}>
                        <TouchableOpacity activeOpacity={0.8} onPress={this._imagePicker.bind(this)}>
                            <View style={styles.photoMainCell}>
                                <Text style={styles.photoMainCellText}>{this.state.language.app_photo_name}</Text>
                                <Image style={styles.photoMainCellImg} source={{uri: this.state.avatar}}/>
                                <Image style={styles.photoMainCellRight} source={require('../../Image/rightImage.png')}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
    // 打开modal
    _imagePicker() {
        const options = {
            //底部弹出框选项
            title: '选择图片',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '选择照片',
            cameraType: 'back',
            mediaType: 'photo',
            videoQuality: 'high',
            durationLimit: 10,
            maxWidth: 200,
            maxHeight: 200,
            quality: 0.8,
            angle: 0,
            allowsEditing: false,
            noData: false,
            storageOptions: {
                skipBackup: true,
                cameraRoll: true,
            }
        }
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                let file;
                if(Utils.size.OS === 'android'){
                    file = response.uri
                }else {
                    file = response.uri.replace('file://', '')
                }
                this._fetchImage(response, file);
            }
        });
    }

    // 上传图片
    async _fetchImage (response, record) {
        try {
            let UserId = await AsyncStorage.getItem('UserId');
            let data = await Utils.uploadImage(Utils.size.os === 'ios' ? record : response.uri, response.fileName, UserId);
            console.log(data);
            if (Number(data.code) === 0) {
                Loading.Toast(this.state.language.toast_photo_code_true);
                this.setState({
                    avatar: data.result.avatar
                })
                this.onBackButton();
            } else {
                Loading.Toast(data.message)
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    contentBg: {
        backgroundColor: '#ccc'
    },
    // 内容
    photoMain: {
        marginTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#fff',
    },
    photoMainCell: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoMainCellText: {
        flex: 1,
        fontSize: Utils.setSpText(15),
    },
    photoMainCellImg: {
        width: 50,
        height: 50,
    },
    photoMainCellRight: {
        marginLeft: 10,
        width: 15,
        height: 15,
    },
    alertBackground:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'rgba(0, 0, 0, 0.5)',
    },
    alertBox: {
        width:200,
        height:160,
        backgroundColor:'white',
        // justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle:{
        height: 40,
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalItem: {
        height: 40,
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

