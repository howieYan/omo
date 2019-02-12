import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    AsyncStorage,
} from 'react-native';
import Utils from "./Utils";
import {TextInputLayout} from 'rn-textinputlayout';
import {Loading} from './Loading';
export default class ForgotPassword extends React.Component {
    static navigationOptions = ({navigation}) => ({
        headerTitle: navigation.state.params.name,
        headerTintColor: '#fff',
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
            mobile: '',
            isMobile: /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/,
            checkCode: '',
            isCheckCode: /^\d{6}$/,
            pwd: '',
            isPwd: /^[a-zA-Z0-9]{6,20}$/,
            eqPwd: '',
            isRePwd: /^[a-zA-Z0-9]{6,20}$/,
            codeName: '获取验证码',
            isCode: false,
            isOnClick: false,
            language: {},
        }
    }
    componentDidMount () {
        this.LoadData();
    }
    async LoadData () {
        try {
            let results = await AsyncStorage.getItem('language');
            this.setState({
                language: JSON.parse(results),
                codeName: JSON.parse(results).login_input_codeName,
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    render() {
        return (
            <View style={[styles.content, styles.contentBg]}>
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
                                placeholder={this.state.language.reg_input_mobile}
                            />
                        </TextInputLayout>

                    </View>
                    <View style={styles.editMainMomy}>
                        <TextInputLayout style={styles.inputLayout}
                                         checkValid={t => this.state.isCheckCode.test(t)}
                        >
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
                    <View style={styles.editMainMomy}>
                        <TextInputLayout
                            style={styles.inputLayout}
                            checkValid={t => this.state.isPwd.test(t)}
                        >
                            <TextInput
                                style={styles.textInput}
                                placeholder={this.state.language.findPwd_input_pwd}
                                maxLength={20}
                                onChangeText={(text) =>this.setState({pwd: text})}
                                value={this.state.pwd}
                                secureTextEntry={true}
                            />
                        </TextInputLayout>
                    </View>
                    <View style={styles.editMainMomy}>
                        <TextInputLayout
                            style={styles.inputLayout}
                            checkValid={t => this.state.isRePwd.test(t)}
                        >
                            <TextInput
                                style={styles.textInput}
                                placeholder={this.state.language.findPwd_input_eqPwd}
                                maxLength={20}
                                onChangeText={(text) =>this.setState({eqPwd: text})}
                                value={this.state.eqPwd}
                                secureTextEntry={true}
                            />
                        </TextInputLayout>
                    </View>
                    <TouchableOpacity activeOpacity={0.8} onPress={this._onPressLearnMore.bind(this)}>
                        <View style={[styles.NewMoneyButtonBgCol]}>
                            <Text style={styles.NewMoneyButtonText}>{this.state.language.findPwd_button}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.bottomLogin}>
                        <TouchableOpacity activeOpacity={0.8}
                                          onPress={this.onBackButton.bind(this)}>
                            <View style={styles.bottomLoginStyle}>
                                <Text style={styles.bottomLoginText}>{this.state.language.reg_bottom_text}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
    // 返回
    onBackButton () {
        this.props.navigation.goBack()
    }
    // 注册
    _onPressLearnMore () {
        if (!this.state.mobile) {
            Loading.Toast(this.state.language.toast_login_mobile);
        } else if (!this.state.checkCode) {
            Loading.Toast(this.state.language.toast_Register_checkCode);
        } else if (!this.state.pwd) {
            Loading.Toast(this.state.language.toast_login_pwd);
        } else if (!this.state.eqPwd) {
            Loading.Toast(this.state.language.toast_FindPwd_eqPwd);
        } else if (this.state.pwd === this.state.eqPwd) {
            this.AsyncOnRegister();
        } else {
            Loading.Toast(this.state.language.toast_FindPwd_isEqPwd);
        }
    }
    async AsyncOnRegister () {
        try {
            let lang = await AsyncStorage.getItem('lang');
            let formData = new FormData();
            formData.append('mobile', this.state.mobile);
            formData.append('checkCode', this.state.checkCode);
            formData.append('pwd', this.state.pwd);
            formData.append('eqPwd', this.state.eqPwd);
            formData.append('lang', lang);
            let data = await Utils.postJSON(Utils.size.url + '/v1/authorization/findPwd', formData);
            if (Number(data.code) === 0) {
                Loading.Toast(this.state.language.toast_FindPwd_code_true);
                this.onBackButton();
            } else {
                Loading.Toast(data.message)
            }
        }
        catch (e) {
            console.log(e);
        }
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
            let lang = await AsyncStorage.getItem('lang');
            let formData = new FormData();
            formData.append('mobile', this.state.mobile);
            formData.append('lang', lang);
            let data = await Utils.postJSON(Utils.size.url + '/v1/authorization/getCode', formData);
            console.log(data);
            if (Number(data.code === 0)) {
                Loading.Toast(this.state.language.toast_FindPwd_Loading_show_code);
            } else {
                Loading.Toast(data.message)
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
    },
    // 文本
    NewMoneyTitle: {
        backgroundColor: '#076bb8',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
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
    NewMoneyText: {
        flexDirection: 'row',
        height: 40,
        paddingLeft: 10,
        alignItems: 'center',
    },
    NewMoneyRadioIm: {
        width: 30,
        height: 40,
        justifyContent: 'center',
    },
    NewMoneyRadio: {
        width: 15,
        height: 15,
    },
    NewMoneyRadioText: {
        fontSize: Utils.setSpText(14),
        color: '#fff'
    },
    onNewMoneyRadioText: {
        paddingLeft: 5,
        color: '#52c2cf',
        fontSize: Utils.setSpText(14),
        fontWeight: '500',
    },
    NewMoneyButton: {
        backgroundColor: '#d6d6d6',
        paddingTop:15,
        paddingBottom: 15,
        alignItems: 'center',
        borderRadius: 4,
    },
    NewMoneyButtonBgCol: {
        marginTop: 20,
        backgroundColor: '#ff6a03',
        paddingTop:15,
        paddingBottom: 15,
        alignItems: 'center',
        borderRadius: 4,
    },
    NewMoneyButtonText: {
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
        paddingTop: 20,
    },
    bottomLoginText: {
        fontSize: Utils.setSpText(16),
        color: '#fff',
    },
    bottomLoginStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    }
});
