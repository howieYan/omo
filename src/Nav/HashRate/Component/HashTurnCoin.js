import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity, InteractionManager, TextInput, AsyncStorage, ToastAndroid, Image, Animated
} from 'react-native';
import Utils from "../../../Components/Utils";
import {Loading} from "../../../Components/Loading";
import {TextInputLayout} from 'rn-textinputlayout';
export default class HashTurnCoin extends React.Component {
    static navigationOptions = ({navigation}) => ({
        headerTitle: navigation.state.params.name,
        headerTintColor: '#fff',
        headerTitleStyle:{
            flex:1,
            textAlign: 'center',
        },
        headerStyle: {
            backgroundColor: '#000',
        },
        headerRight: <View/>,
    })
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            walletCode: '',
            currencyNumber: '',
            pwd: '',
            isPwd: /^[a-zA-Z0-9]{6,20}$/,
            language: {},
            transferList: [],
            transferType: ''
        }
    }
    componentDidMount () {
        this.listData();
    }
    async listData() {
        try{
            let results = await AsyncStorage.getItem('language');
            this.setState({
                language: JSON.parse(results),
            });
            let lang = await  AsyncStorage.getItem('lang');
            let UserId = await AsyncStorage.getItem('UserId');
            let formData = new FormData();
            formData.append('user_id', UserId);
            formData.append('lang', lang);
            let data = await Utils.postJSON(Utils.size.url + '/v1/contract/getInfo', formData);
            let transferList = await Utils.postJSON(Utils.size.url + '/v1/contract/profitType');
            console.log(transferList);
            if (Number(data.code) === 0) {
                this.setState({
                    data: data.result,
                    transferList: transferList.result
                })
            } else {
                Loading.Toast(data.message );
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    render() {
        return (
            <View style={styles.content}>
                <View style={[styles.content,styles.aboutUsMainList]}>
                    <View style={styles.NewMoneyMain}>
                        <View style={styles.editHeader}>
                            {this.RenderHeader()}
                        </View>
                        <View style={styles.editMainMomy}>
                            <TextInputLayout
                                style={styles.inputLayout}>
                                <TextInput
                                    style={styles.textInput}
                                    onChangeText={(text) =>this.setState({walletCode: text})}
                                    value={this.state.walletCode}
                                    placeholder={this.state.language.app_Operate_Contract_TurnCoin_input_Code}
                                />
                            </TextInputLayout>

                        </View>
                        <View style={styles.editMainMomy}>
                            <TextInputLayout style={styles.inputLayout}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={this.state.language.app_Operate_Contract_TurnCoin_input_currencyNumber}
                                    onChangeText={(text) =>this.setState({currencyNumber: text})}
                                    value={this.state.currencyNumber}
                                />
                            </TextInputLayout>
                        </View>
                        <View style={styles.editMainMomy}>
                            <TextInputLayout
                                style={styles.inputLayout}
                                checkValid={t => this.state.isPwd.test(t)}>
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
                        <Text style={{color: '#fff',paddingTop: 20,}}>{this.state.language.app_Operate_Contract_TurnCoin_capital}: {this.state.data.profit}</Text>
                        <Text style={{color: '#fff',paddingTop: 20,}}>{this.state.language.app_Operate_Contract_TurnCoin_capitalBalance}: {this.state.data.profitBalance}</Text>
                        <TouchableOpacity activeOpacity={0.8} onPress={this._onPressLearnMore.bind(this)}>
                            <View style={[styles.NewMoneyButtonBgCol]}>
                                <Text style={styles.NewMoneyButtonText}>{this.state.language.app_AboutUs_OnlineMessage_button}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        );
    }
    RenderHeader () {
        let list = [];
        let Array = this.state.transferList;
        if (Array.length > 0) {
            Array.forEach((v, i) => {
                list.push(
                    <TouchableOpacity activeOpacity={0.8} onPress={this.onSelecd.bind(this, v)} key={i}>
                        <View style={{width: (Utils.size.width - 40)/ Array.length, flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={this.state.transferType !== v.tt_id ? require('../../../Image/Options.png'): require('../../../Image/OptionsActive.png')} style={{width: 20,height: 20,}}/>
                            <Text style={{color: '#fff'}}>{v.tt_name}</Text>
                        </View>
                    </TouchableOpacity>
                )
            })
        }
        return list;
    }
    onSelecd (record) {
        this.setState({
            transferType: record.tt_id
        })
    }
    // 返回
    onBackButton () {
        this.props.navigation.goBack()
    }
    // 转帐
    _onPressLearnMore () {
        if (!this.state.transferType) {
            Loading.Toast(this.state.language.toast_Transfer_transferType);
        } else if (!this.state.walletCode) {
            Loading.Toast(this.state.language.app_TurnCoin_walletCode);
        } else if (!this.state.currencyNumber) {
            Loading.Toast(this.state.language.app_TurnCoin_currencyNumber);
        } else if (Number(this.state.currencyNumber) > Number(this.state.data.profit)) {
            Loading.Toast(this.state.language.app_TurnCoin_currencyNumber_profit );
        } else if (!this.state.pwd) {
            Loading.Toast(this.state.language.toast_login_pwd );
        } else {
            this.AsyncOnRegister();
        }
    }
    // 转帐接口
    async AsyncOnRegister () {
        try {
            let lang = await  AsyncStorage.getItem('lang');
            let UserId = await AsyncStorage.getItem('UserId');
            let formData = new FormData();
            formData.append('user_id', UserId);
            formData.append('repeatCode', this.state.walletCode);
            formData.append('currencyNumber', this.state.currencyNumber);
            formData.append('pwd', this.state.pwd);
            formData.append('transferType', this.state.transferType);
            formData.append('lang', lang);
            console.log(formData);
            let data = await Utils.postJSON(Utils.size.url + '/v1/contract/setProfit', formData);
            console.log(data);
            if (Number(data.code) === 0) {
                Loading.Toast(this.state.language.app_TurnCoin_setProfit );
                this.onBackButton();
            } else {
                Loading.Toast(data.message );
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
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
    },
    editHeader: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    textInput: {
        width: Utils.size.width - 20,
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
        width: Utils.size.width,
        justifyContent: 'center',
        alignItems: 'center',

    }
});

