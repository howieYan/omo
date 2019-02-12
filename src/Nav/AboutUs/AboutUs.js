import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
    WebView, InteractionManager, AsyncStorage
} from 'react-native';
import Utils from "../../Components/Utils";
import {Loading} from "../../Components/Loading";
// import Agreement from './Component/Agreement';
// import PrivacyPlokicy from './Component/PrivacyPlokicy';
// import OnlineMessage from './Component/OnlineMessage';
export default class AboutUs extends React.Component {
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
            list: {},
            language: {},
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
            let formData = new FormData();
            formData.append('lang' , lang)
            let result = await  Utils.postJSON(Utils.size.url + '/v1/authorization/about', formData);
            console.log(result);
            if (Number(result.code) === 0) {
                this.setState({
                    list: result.result
                })
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    render() {
        return (
            <View style={styles.content}>
                <View style={[styles.content]}>
                    <View style={styles.aboutUsHead}>
                        {this.state.list.new_img ? <Image source={{ uri: Utils.size.url + this.state.list.new_img }} style={styles.aboutUsHeadLogo}/> : <Text/>}
                        <Text style={[styles.aboutUsHeadVersions, styles.aboutUsHeadName]}>{this.state.list.new_title}</Text>
                        <WebView
                            bounces={false}
                            originWhitelist={['*']}
                            scalesPageToFit={Utils.size.os === 'ios' ? false : true}
                            source={{html: this.state.list.new_content,  baseUrl: ''}}
                            style={{width: Utils.size.width, height: Utils.size.height}}>
                        </WebView>
                    </View>
                    <View style={styles.aboutUsMainList}>
                        {this.renderList()}
                    </View>
                </View>
            </View>
        );
    }
    renderList () {
        let list = [];
        let array = [
            {title: this.state.language.app_AboutUs_Agreement, img: require('../../Image/rightImage.png'), component: 'Agreement'},
            {title: this.state.language.app_AboutUs_PrivacyPlokicy, img: require('../../Image/rightImage.png'), component: 'PrivacyPlokicy'},
            {title: this.state.language.app_AboutUs_OnlineMessage, img: require('../../Image/rightImage.png'), component: 'OnlineMessage'}
        ];
        array.forEach((v, i) => {
            list.push(
                <TouchableOpacity key={i}
                                  activeOpacity={0.8}
                                  onPress={this.onComponent.bind(this, v.component, v.title)}>
                    <View style={styles.cellList}>
                        <Text style={styles.cellListText}>{v.title}</Text>
                        <Image style={styles.cellListRightImg} source={v.img}/>
                    </View>
                </TouchableOpacity>
            )
        })
        return list;
    }
    // 组建
    onComponent (record, title) {
        this.props.navigation.navigate(record, {name: title})
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    // 内容
    aboutUsHead: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        width: Utils.size.width,
        alignItems: 'center'
    },
    aboutUsHeadLogo: {
        width: 50,
        height: 50,
    },
    aboutUsHeadVersions: {
        paddingTop: 20,
        fontSize: Utils.setSpText(12),
        color: '#333',
    },
    aboutUsHeadName: {
        paddingTop: 20,
        lineHeight: 20,
        fontSize: Utils.setSpText(14),
        color: '#333',
    },
    aboutUsMainList: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#ececec',
    },
    cellList: {
        height: 50,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#ececec',
        borderBottomWidth: 1,
    },
    cellListText: {
        flex: 1,
        fontSize: Utils.setSpText(16),
    },
    cellListRightImg: {
        width: 15,
        height: 15,
    },
});

