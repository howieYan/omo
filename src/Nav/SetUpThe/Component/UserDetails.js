import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
    TextInput, ScrollView, InteractionManager, ToastAndroid, AsyncStorage,
} from 'react-native';
import Utils from "../../../Components/Utils";
import {TextInputLayout} from 'rn-textinputlayout';
import {Loading} from '../../../Components/Loading';
export default class UserDetails extends React.Component {
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
            user_id: '',
            real_name: '',
            isReal_name: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
            carded: '',
            isCarded: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            email: '',
            isEmail: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
            house_name: '',
            account_number: '',
            deposit_bank: '',
            alipay: '',
            wechat_number: '',
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
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    render() {
        return (
            <View style={styles.content}>
                <View style={[styles.content, styles.contentBg]}>
                    <ScrollView>
                        <View style={styles.NewMoneyMain}>
                            <View style={styles.editMainMomy}>
                                <TextInputLayout
                                    style={styles.inputLayout}
                                    checkValid={t => this.state.isReal_name.test(t)}>
                                    <TextInput
                                        style={styles.textInput}
                                        onChangeText={(text) =>this.setState({real_name: text})}
                                        value={this.state.real_name}
                                        placeholder={this.state.language.app_UserDetails_input_real_name}
                                    />
                                </TextInputLayout>
                            </View>
                            <View style={styles.editMainMomy}>
                                <TextInputLayout
                                    style={styles.inputLayout}
                                    checkValid={t => this.state.isCarded.test(t)}>
                                    <TextInput
                                        style={styles.textInput}
                                        onChangeText={(text) =>this.setState({carded: text})}
                                        value={this.state.carded}
                                        placeholder={this.state.language.app_UserDetails_input_carded}
                                    />
                                </TextInputLayout>

                            </View>
                            <View style={styles.editMainMomy}>
                                <TextInputLayout style={styles.inputLayout}
                                                 checkValid={t => this.state.isEmail.test(t)}
                                >
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder={this.state.language.app_UserDetails_input_email}
                                        onChangeText={(text) =>this.setState({email: text})}
                                        value={this.state.email}
                                    />
                                </TextInputLayout>
                            </View>
                            <View style={styles.editMainMomy}>
                                <TextInputLayout style={styles.inputLayout}>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder={this.state.language.app_UserDetails_input_house_name}
                                        onChangeText={(text) =>this.setState({house_name: text})}
                                        value={this.state.house_name}
                                    />
                                </TextInputLayout>
                            </View>
                            <View style={styles.editMainMomy}>
                                <TextInputLayout
                                    style={styles.inputLayout}>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder={this.state.language.app_UserDetails_input_account_number}
                                        onChangeText={(text) =>this.setState({account_number: text})}
                                        value={this.state.account_number}
                                    />
                                </TextInputLayout>
                            </View>
                            <View style={styles.editMainMomy}>
                                <TextInputLayout
                                    style={styles.inputLayout}>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder={this.state.language.app_UserDetails_input_deposit_bank}
                                        onChangeText={(text) =>this.setState({deposit_bank: text})}
                                        value={this.state.deposit_bank}
                                    />
                                </TextInputLayout>
                            </View>
                            <View style={styles.editMainMomy}>
                                <TextInputLayout
                                    style={styles.inputLayout}>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder={this.state.language.app_UserDetails_input_alipay}
                                        onChangeText={(text) =>this.setState({alipay: text})}
                                        value={this.state.alipay}
                                    />
                                </TextInputLayout>
                            </View>
                            <View style={styles.editMainMomy}>
                                <TextInputLayout
                                    style={styles.inputLayout}>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder={this.state.language.app_UserDetails_input_wechat_number}
                                        onChangeText={(text) =>this.setState({wechat_number: text})}
                                        value={this.state.wechat_number}
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
    // 注册
    _onPressLearnMore () {
        if (!this.state.real_name) {
            Loading.Toast(this.state.language.toast_UserDetails_real_name);
        } else if (!this.state.carded) {
            Loading.Toast(this.state.language.toast_UserDetails_carded);
        } else if (!this.state.email) {
            Loading.Toast(this.state.language.toast_UserDetails_email);
        } else if (!this.state.house_name) {
            Loading.Toast(this.state.language.toast_UserDetails_house_name);
        } else if (!this.state.account_number) {
            Loading.Toast(this.state.language.toast_UserDetails_account_number);
        } else if (!this.state.deposit_bank) {
            Loading.Toast(this.state.language.toast_UserDetails_deposit_bank);
        } else if (!this.state.alipay) {
            Loading.Toast(this.state.language.toast_UserDetails_alipay);
        } else if (!this.state.wechat_number) {
            Loading.Toast(this.state.language.toast_UserDetails_wechat_number);
        } else {
            this.AsyncOnRegister();
        }
    }
    // 返回
    onBackButton () {
        this.props.navigation.goBack();
    }
    async AsyncOnRegister () {
        try {
            let lang = await  AsyncStorage.getItem('lang');
            let formData = new FormData();
            let UserId = await AsyncStorage.getItem('UserId');
            formData.append('user_id', UserId);
            formData.append('lang', lang);
            formData.append('real_name', this.state.real_name);
            formData.append('carded', this.state.carded);
            formData.append('email', this.state.email);
            formData.append('house_name', this.state.house_name);
            formData.append('account_number', this.state.account_number);
            formData.append('deposit_bank', this.state.deposit_bank);
            formData.append('alipay', this.state.alipay);
            formData.append('wechat_number', this.state.wechat_number);
            let data = await Utils.postJSON(Utils.size.url + '/v1/contract/profile', formData);
            if (Number(data.code) === 0) {
                Loading.Toast(this.state.language.toast_UserDetails_Loading_show_code_true);
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
        flex: 1,
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
        flex: 1,
        backgroundColor: '#2b2b2b',
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
        color: '#8d99a8'
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

    inputLayout: {
        flex: 1,
    },
    OncheckCode: {
        backgroundColor: '#f20',
        borderRadius: 5,
        paddingLeft: 5,
        paddingRight: 5,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    OncheckCodeBg: {
        backgroundColor: '#333',
        borderRadius: 5,
        paddingLeft: 5,
        paddingRight: 5,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    OncheckCodeText: {
        fontSize: Utils.setSpText(16),
        color: '#fff',
    },
    bottomLogin: {
        flexDirection: 'row',
        width: Utils.size.width,
        paddingTop: 20,
    },
    bottomLoginText: {
        fontSize: Utils.setSpText(16),
        color: '#333',
    },
    bottomLoginStyle: {
        width: Utils.size.width/ 2 - 40,
        justifyContent: 'center',
        alignItems: 'center',

    }
});
