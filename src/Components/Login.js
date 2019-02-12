import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
    TextInput,
    AsyncStorage,
    StatusBar,
    InteractionManager,
    ToastAndroid,
    BackHandler,
    ScrollView
} from 'react-native';
import Utils from "./Utils";
import {TextInputLayout} from 'rn-textinputlayout';
import {Loading} from './Loading';
import Registered from "./Registered";
// import Register from './Register';
// import Index from "./Index";
// import FindPwd from './FindPwd';
// import FindPwdA from './Stting/FindPwd';
export default class Login extends React.Component {
    static navigationOptions = ({navigation}) => ({
        headerTintColor: '#000',
        headerTitleStyle:{
            flex:1,
            textAlign: 'center'
        },
        headerStyle: {
            backgroundColor: '#000',
            borderBottomWidth: 0
        },
        headerRight: <View />,
    })
    constructor(props) {
        super(props);
        this.state = {
            language: {},
            mobile: '',
            // isMobile: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
            isMobile: /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/,
            pwd: '',
            isPwd: /^[a-zA-Z0-9]{6,20}$/,
            checkCode: '',
            isCheckCode: /^\d{6}$/,
            isRadio: false,
            wallet: null,
            list: null,
            isLoading: false,
            codeName: '',
            isCode: false,
            isOnClick: false,
        }
    }
    componentDidMount () {
        this.LoadData();
    }
    async LoadData () {
        try {
            let results = await AsyncStorage.getItem('lang');
            if (!results) {
                AsyncStorage.setItem('lang', 'tw');
            }
            let formData = new FormData();
            formData.append("lang", results);
            let data = await Utils.postJSON(Utils.size.url + '/v1/settings/getLang', formData);
            if (Number(data.code) === 0) {
                if (data.result.length === 0) {
                    this.LoadData()
                } else {
                    AsyncStorage.setItem('language', JSON.stringify(data.result));
                    this.setState({
                        language: data.result,
                        codeName: data.result.login_input_codeName,
                    });
                }

            }
            console.log(this.state.language);
        }
        catch (e) {
            console.log(e);
        }
    }
    render() {
        return (
            <View style={styles.content}>
                <View style={[styles.contentBg]}>
                    <View style={styles.AppIcon}>
                        <Image style={styles.AppIconImage} source={require('../Image/appIcon.png')}/>
                        <Text style={styles.AppIconText}>{this.state.language.app_appIcon_name}</Text>
                    </View>
                    <View style={styles.NewMoneyMain}>
                        <View style={styles.editMainMomy}>
                            <TextInputLayout
                                style={styles.inputLayout}
                                checkValid={t => this.state.isMobile.test(t)}>
                                <TextInput
                                    maxLength={11}
                                    style={styles.textInput}
                                    onChangeText={(text) =>this.setState({mobile: text})}
                                    value={this.state.mobile}
                                    placeholder={this.state.language.app_EditPwd_input_phone}
                                />
                            </TextInputLayout>

                        </View>
                        <View style={styles.editMainMomy}>
                            <TextInputLayout
                                style={styles.inputLayout}
                                checkValid={t => this.state.isPwd.test(t)}
                            >
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={this.state.language.login_input_pwd}
                                    maxLength={20}
                                    onChangeText={(text) =>this.setState({pwd: text})}
                                    value={this.state.pwd}
                                    secureTextEntry={true}
                                />
                            </TextInputLayout>
                        </View>
                        <View style={styles.editMainMomy}>
                            <TextInputLayout style={styles.inputLayout}
                                             checkValid={t => this.state.isCheckCode.test(t)}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={this.state.language.login_input_checkCode}
                                    maxLength={6}
                                    onChangeText={(text) =>this.setState({checkCode: text})}
                                    value={this.state.checkCode}
                                />
                            </TextInputLayout>
                            <TouchableOpacity activeOpacity={0.8} onPress={this.onCheckCode.bind(this)}>
                                <View style={[!this.state.isCode ? styles.OncheckCode : styles.OncheckCodeBg]}>
                                    <Text style={styles.OncheckCodeText}>{this.state.codeName}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity activeOpacity={0.8} onPress={this._onPressLearnMore.bind(this)}>
                            <View style={[styles.NewMoneyButtonBgCol]}>
                                <Text style={[styles.NewMoneyButtonTextBg]}>{this.state.language.login_title}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.bottomLogin}>
                            <TouchableOpacity activeOpacity={0.8}
                                              navigator={this.props.navigator}
                                              onPress={this._onPressRegister.bind(this)}>
                                <View style={styles.bottomLoginStyle}>
                                    <Text style={styles.bottomLoginText}>{this.state.language.login_button_bottom_text_left}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8}
                                              navigator={this.props.navigator}
                                              onPress={this._onPressFindPwd.bind(this)}>
                                <View style={styles.bottomLoginStyle}>
                                    <Text style={styles.bottomLoginText}>{this.state.language.login_button_bottom_text_right}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
    // 登录
    _onPressLearnMore () {
        if (!this.state.mobile) {
            Loading.Toast(this.state.language.toast_login_mobile);
        }else if (!this.state.pwd) {
            Loading.Toast(this.state.language.toast_login_pwd);
        }else if (!this.state.checkCode) {
            Loading.Toast(this.state.language.toast_Register_checkCode);
        } else{
            this.LoadLogin();
        }
    }
    // 登录接口
    async LoadLogin () {
        try {
            let lang = await  AsyncStorage.getItem('lang');
            let formData = new FormData();
            formData.append('mobile', this.state.mobile);
            formData.append('pwd', this.state.pwd);
            formData.append('lang', lang);
            formData.append('checkCode', this.state.checkCode);
            let data = await Utils.postJSON(Utils.size.url + '/v1/authorization/login', formData);
            if (Number(data.code) === 0) {
                this.setAsync(data.result.user_id);
                Loading.Toast(this.state.language.toast_login_code_true);
                Loading.hidden();
            } else {
                Loading.hidden();
                Loading.Toast(data.message);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    // 存user_id
    setAsync (recode) {
        AsyncStorage.setItem('UserId', recode);
        this.props.navigation.navigate('Home')
    }
    // 立即注册
    _onPressRegister  () {
        this.props.navigation.navigate('Registered', { name: this.state.language.reg_title,})
    }
    // 忘记密码
    _onPressFindPwd () {
        this.props.navigation.navigate('ForgotPassword', { name: this.state.language.login_button_bottom_text_right,})
    }
    // 获取验证码
    onCheckCode () {
        if (this.state.mobile) {
            this.setState({
                isOnClick: true,
            })
            if (!this.state.isOnClick) {
                this.loadGetCode();
            }
            let time = 60;
            let _this = this;
            let int = setInterval(function () {
                time --;
                _this.setState({
                    codeName: _this.state.language.login_input_isCodeName +'(' + (time) + 's)',
                    isCode: true,
                })
                if (time === 0) {
                    clearInterval(int);
                    _this.setState({
                        codeName: _this.state.language.login_input_codeName,
                        isCode: false,
                        isOnClick: false,
                    })
                }
            }, 1000);
        } else {
           Loading.Toast(this.state.language.app_login_toast);
        }
    }
    // 验证码
    async loadGetCode () {
        try {
            let formData = new FormData();
            let lang = await  AsyncStorage.getItem('lang');
            formData.append('mobile', this.state.mobile);
            formData.append('lang', lang);
            let data = await Utils.postJSON(Utils.size.url + '/v1/authorization/getCode', formData);
            if (Number(data.code === 0)) {
                Loading.Toast(this.state.language.toast_FindPwd_Loading_show_code);
            } else {
                Loading.Toast(data.message);
            }
        }
        catch (e) {
            console.log(e)
        }
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    contentBg: {
        backgroundColor: '#2b2b2b',
        flex: 1,
    },
    // 文本
    NewMoneyTitleText: {
        color: '#fff',
        paddingLeft: 10,
    },
    NewMoneyTitleH: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 20,
    },
    NewMoneyTitleL: {
        width: 6,
        height: 6,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#fff',
    },
    NewMoneyMain: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    textInput: {
        width: Utils.size.width - 120,
        height: 40,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        color: '#fff',
        fontSize: Utils.setSpText(14),
    },
    paddingT: {
        paddingTop: 8,
    },
    editMainMomy: {
        flexDirection: 'row',
        paddingTop: 10,
    },
    editWidth: {
        width: Utils.size.width - 60,
    },
    editSweep: {
        width: 20,
        height: 20,
    },
    NewMoneyButton: {
        backgroundColor: '#fff',
        paddingTop:15,
        paddingBottom: 15,
        alignItems: 'center',
        borderRadius: 4,
    },
    NewMoneyButtonBgCol: {
        marginTop: 10,
        backgroundColor: '#ff6a03',
        paddingTop:15,
        paddingBottom: 15,
        alignItems: 'center',
        borderRadius: 4,
    },
    NewMoneyButtonText: {
        fontSize: Utils.setSpText(14),
        color: '#000',
    },
    NewMoneyButtonTextBg: {
        fontSize: Utils.setSpText(14),
        color: '#fff',
    },
    textInputs: {
        fontSize: 16,
        height: 40
    },
    inputLayout: {
        flex: 1,
    },
    OncheckCode: {
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#ff6a03',
        borderRadius: 5,
        paddingLeft: 5,
        paddingRight: 5,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    OncheckCodeBg: {
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#ff6a03',
        borderRadius: 5,
        paddingLeft: 5,
        paddingRight: 5,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    OncheckCodeText: {
        fontSize: Utils.setSpText(16),
        color: '#ff6a03',
    },
    bottomLogin: {
        flexDirection: 'row',
        width: Utils.size.width - 40,
        paddingTop: 20,
    },
    bottomLoginText: {
        fontSize: Utils.setSpText(16),
        color: '#fff',
    },
    bottomLoginStyle: {
        width: (Utils.size.width- 40) / 2,
        justifyContent: 'center',
        alignItems: 'center',

    },
    AppIcon: {
        paddingTop: 80,
        width: Utils.size.width,
        alignItems: 'center',
    },
    AppIconImage: {
        width: 50,
        height:50,
    },
    AppIconText: {
        paddingTop: 10,
        color: '#fff',
        fontSize: Utils.setSpText(16)
    }
});
