import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    AsyncStorage,
    Alert,
    Linking
} from 'react-native';
import Utils from "../../Components/Utils";
import {Loading} from "../../Components/Loading";
export default class FileDownload extends React.Component {
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
            avatar: '',
            list: [],
            total: null,
            language: {},
        };
    }
    componentDidMount () {
        this.loadData();
    }
    async loadData () {
        try {
            let language = await AsyncStorage.getItem('language');
            this.setState({
                language: JSON.parse(language),
            });
            let data = await Utils.postJSON(Utils.size.url + '/v1/contract/getDoc');
            if (Number(data.code) === 0) {
                this.setState({
                    list: data.result.list,
                    total: data.result.total
                });
            } else {
                Loading.Toast(data.message)
            }

        }
        catch (e) {
            console.log(e)
        }
    }
    render() {
        return (
            <View style={styles.content}>
                <View style={styles.FileDownload}>
                    {this.readerList()}
                </View>
            </View>
        );
    }
    readerList () {
        let list = [];
        if (Number(this.state.total) > 0) {
            this.state.list.forEach((v, i) => {
                list.push(
                    <View style={styles.FileDownloadStyle} key={i} >
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Image style={styles.FileDownloadImg} source={require('../../Image/file.png')}/>
                            <View style={styles.content}>
                                <Text style={styles.FileDownloadText} numberOfLines={1}>{v.documentName}</Text>
                            </View>
                            <TouchableOpacity  activeOpacity={0.8} onPress={this.onAlert.bind(this, v)}>
                                <View style={styles.FileDownloadButton}>
                                    <Text style={styles.FileDownloadButtonText}>{this.state.language.app_FileDownload_text}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            })
        } else {
            list.push(
                <View style={styles.content} key={this.state.total}>
                    <View style={{alignItems: 'center', justifyContent: 'center', height: 400}}>
                        <Text style={{fontSize: 16}}>{this.state.language.app_Operate_Contract_Record_null}</Text>
                    </View>
                </View>
            )
        }
        return list;
    }
    onAlert (name) {
        Alert.alert(
            this.state.language.app_FileDownload_text,
            this.state.language.app_FileDownload_Alert_text + name.documentName,
            [
                {text: this.state.language.app_options_cancelButtonTitle, onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: this.state.language.findPwd_button, onPress: () => this.onDownLoad(name)},
            ],
            { cancelable: false }
        )
    }
    onDownLoad (url) {
        Linking.canOpenURL(url.documentURI)
            .then(supported => {
                if (!supported) {
                    console.log('Can\'t handle url: ' + url.documentURI);
                } else {
                    return Linking.openURL(url.documentURI)
                }
            }).catch(err => console.error('An error occurred', err));
    }

}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    contentBg: {
        backgroundColor: '#2b2b2b',
    },
    // 内容
    FileDownload: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    FileDownloadStyle:{
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    FileDownloadImg: {
        width: 30,
        height: 40,
    },
    FileDownloadText: {
        paddingLeft: 10,
        fontSize: Utils.setSpText(16),
        color: '#38424A'
    },
    FileDownloadButton: {
        backgroundColor: '#F36269',
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 30,
    },
    FileDownloadButtonText: {
        fontSize: Utils.setSpText(14),
        color: '#fff',
    }
});

