import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
    TextInput, AsyncStorage, InteractionManager, ToastAndroid
} from 'react-native';
import Utils from "../../../Components/Utils";
import {Loading} from "../../../Components/Loading";

export default class OnlineMessage extends React.Component {
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
            title: '',
            content: '',
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
                <View style={[styles.content]}>
                    <View style={styles.OnlineMessage}>
                        <View style={styles.OnlineMessageTitle}>
                            <Text style={styles.OnlineMessageTitleText}>{this.state.language.app_AboutUs_OnlineMessage_title}:</Text>
                            <View style={styles.OnlineMessageTitleInputStyle}>
                                <TextInput
                                    style={styles.OnlineMessageTitleInput}
                                    onChangeText={(text) => this.setState({title:text})}
                                    value={this.state.title}
                                />
                            </View>
                        </View>
                        <View style={[styles.OnlineMessageTitlePadd]}>
                            <Text style={styles.OnlineMessageTitleText}>{this.state.language.app_AboutUs_OnlineMessage_content}:</Text>
                            <View style={styles.OnlineMessageTitleInputStyle}>
                                <TextInput
                                    style={styles.OnlineMessageTitleInputContent}
                                    onChangeText={(text) => this.setState({content:text})}
                                    value={this.state.content}
                                    multiline = {true}
                                />
                            </View>
                        </View>
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

    // 提交
    _onPressLearnMore () {
        if (!this.state.title) {
            Loading.Toast(this.state.language.app_OnlineMessage_title);
        } else if (!this.state.content) {
            Loading.Toast(this.state.language.app_OnlineMessage_content);
        } else {
            this.AsyncOnRegister();
        }
    }
    // 提交接口
    async AsyncOnRegister () {
        try {
            let lang = await  AsyncStorage.getItem('lang');
            let UserId = await AsyncStorage.getItem('UserId');
            let formData = new FormData();
            formData.append('lang', lang);
            formData.append('user_id', UserId);
            formData.append('title', this.state.title);
            formData.append('content', this.state.content);
            let data = await Utils.postJSON(Utils.size.url + '/v1/contract/feedback', formData);
            console.log(data);
            if (Number(data.code) === 0) {
                Loading.Toast(this.state.language.toast_UserDetails_Loading_show_code_true);
            } else {
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
    // 内容
    OnlineMessage: {
        marginTop: 30,
        paddingLeft: 10,
        paddingRight: 10,
    },
    OnlineMessageTitle: {
        flexDirection: 'row',
        height: 50,
        width: Utils.size.width - 20,
        alignItems: 'center',
    },
    OnlineMessageTitleText: {
        fontSize: Utils.setSpText(15),
    },
    OnlineMessageTitleInput: {
        height: 40,
        paddingLeft: 10,
        fontSize: Utils.setSpText(14),
        borderBottomColor: '#ccc',
        borderBottomWidth: Utils.size.os === 'ios' ? 1 : 0
    },
    OnlineMessageTitleInputContent: {
        height: 150,
        fontSize: Utils.setSpText(14),
        paddingLeft: 10,
        borderColor: '#ccc',
        borderWidth: Utils.size.os === 'ios' ? 1 : 0
    },
    OnlineMessageTitleInputStyle: {
        width: Utils.size.width - 60,
    },
    OnlineMessageTitlePadd: {
        flexDirection: 'row',
        height: 150,
        width: Utils.size.width - 20,
        paddingTop: 20,
    },
    NewMoneyButtonBgCol: {
        marginTop: 50,
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
});

