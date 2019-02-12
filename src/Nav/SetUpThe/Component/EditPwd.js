import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    AsyncStorage,
} from 'react-native';
import Utils from "../../../Components/Utils";
import {TextInputLayout} from 'rn-textinputlayout';
import {Loading} from "../../../Components/Loading";
export default class EditPwd extends React.Component {
    static navigationOptions = ({navigation}) => ({
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
            old_pwd: '',
            isOld_pwd: /^[a-zA-Z0-9]{6,20}$/,
            phone: '',
            isPhone: /(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/,
            checkCode: '',
            isCheckCode: /^\d{6}$/,
            u_pwd: '',
            isU_pwd: /^[a-zA-Z0-9]{6,20}$/,
            u_pwd2: '',
            isU_pwd2: /^[a-zA-Z0-9]{6,20}$/,
            codeName: '获取验证码',
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
            <View style={styles.content}>
                <View style={[styles.content, styles.aboutUsMainList]}>
                    <ScrollView>
                        <View style={styles.NewMoneyMain}>
                            <View style={styles.editMainMomy}>
                                <TextInputLayout
                                    style={styles.inputLayout}
                                    checkValid={t => this.state.isOld_pwd.test(t)}
                                >
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder={this.state.language.app_EditPwd_input_old_pwd}
                                        maxLength={20}
                                        onChangeText={(text) =>this.setState({old_pwd: text})}
                                        value={this.state.old_pwd}
                                        secureTextEntry={true}
                                    />
                                </TextInputLayout>
                            </View>
                            <View style={styles.editMainMomy}>
                                <TextInputLayout
                                    style={styles.inputLayout}
                                    checkValid={t => this.state.isPhone.test(t)}
                                >
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder={this.state.language.app_EditPwd_input_phone}
                                        maxLength={11}
                                        onChangeText={(text) =>this.setState({phone: text})}
                                        value={this.state.phone}
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
                                    checkValid={t => this.state.isU_pwd.test(t)}
                                >
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder={this.state.language.findPwd_input_pwd}
                                        maxLength={20}
                                        onChangeText={(text) =>this.setState({u_pwd: text})}
                                        value={this.state.u_pwd}
                                        secureTextEntry={true}
                                    />
                                </TextInputLayout>
                            </View>
                            <View style={styles.editMainMomy}>
                                <TextInputLayout
                                    style={styles.inputLayout}
                                    checkValid={t => this.state.isU_pwd2.test(t)}
                                >
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder={this.state.language.app_EditPwd_input_u_pwd2}
                                        maxLength={20}
                                        onChangeText={(text) =>this.setState({u_pwd2: text})}
                                        value={this.state.u_pwd2}
                                        secureTextEntry={true}
                                    />
                                </TextInputLayout>
                            </View>
                            <TouchableOpacity activeOpacity={0.8} onPress={this._onPressLearnMore.bind(this)}>
                                <View style={[styles.NewMoneyButtonBgCol]}>
                                    <Text style={styles.NewMoneyButtonText}>{this.state.language.app_UserDetails_button}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
    // 点击获取验证码
    onCheckCode () {
        console.log(this.state.phone);
        if (this.state.phone) {
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
           Loading.Toast(this.state.language.app_login_toast );
        }
    }
    // 验证码接口
    async loadGetCode () {
        try {
            let lang = await  AsyncStorage.getItem('lang');
            let formData = new FormData();
            formData.append('mobile', this.state.phone);
            formData.append('lang', lang);
            let data = await Utils.postJSON(Utils.size.url + '/v1/authorization/getCode', formData);
            console.log(data);
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
    // 返回
    onBackButton () {
        this.props.navigation.goBack();
    }
    _onPressLearnMore () {
        if (!this.state.old_pwd) {
            Loading.Toast(this.state.language.toast_EditPwd_old_pwd);
        } else if (!this.state.phone) {
            Loading.Toast(this.state.language.toast_login_mobile);
        } else if (!this.state.checkCode) {
            Loading.Toast(this.state.language.toast_Register_checkCode);
        } else if (!this.state.u_pwd) {
            Loading.Toast(this.state.language.toast_EditPwd_u_pwd);
        } else if (!this.state.u_pwd2) {
            Loading.Toast(this.state.language.toast_EditPwd_u_pwd2);
        } else if(this.state.u_pwd === this.state.u_pwd2){
            Loading.show(this.state.language.toast_UserDetails_Loading_show);
            this.AsyncOnEditPwd();
        } else {
            Loading.Toast(this.state.language.toast_FindPwd_isEqPwd);
        }
    }
    async AsyncOnEditPwd () {
        try {
            let lang = await  AsyncStorage.getItem('lang');
            let UserId = await AsyncStorage.getItem('UserId');
            let formData = new FormData();
            formData.append('user_id', UserId);
            formData.append('lang', lang);
            formData.append('old_pwd', this.state.old_pwd);
            formData.append('phone', this.state.phone);
            formData.append('checkCode', this.state.checkCode);
            formData.append('u_pwd', this.state.u_pwd);
            formData.append('u_pwd2', this.state.u_pwd2);
            let data = await Utils.postJSON(Utils.size.url + '/v1/contract/editPwd', formData);
            console.log(data);
            if (Number(data.code) === 0) {
                Loading.hidden()
                Loading.Toast(this.state.language.toast_UserDetails_Loading_show_code_true);
                this.onBackButton();
            } else {
                Loading.hidden()
                Loading.Toast(data.message);
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
    aboutUsMainList: {
        backgroundColor: '#2b2b2b'
    },
    // 内容
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
        flexDirection: 'row',
        paddingTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomLoginText: {
        fontSize: Utils.setSpText(16),
        color: '#fff',
    },
    bottomLoginStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

