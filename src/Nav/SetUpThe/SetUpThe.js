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
// import UserDetails from  '../UserDetails';
// import EditPwd from  './EditPwd';
// import EditTrade from  './EditTrade';
export default class SetUpThe extends React.Component {
    static navigationOptions = ({navigation}) => ({
        headerTitle: navigation.state.params ? navigation.state.params.title : '',
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
            data: '',
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
            this.props.navigation.setParams({title: this.state.language.app_nav_name_Stting})
        }
        catch (e) {
            console.log(e);
        }
    }
    render() {
        return (
            <View style={styles.content}>
                <View style={[styles.content, styles.aboutUsMainList]}>
                    <View style={{marginTop: 20}}>
                        {this.renderList()}
                        <TouchableOpacity activeOpacity={0.8}
                                          onPress={this.onCloseLogin.bind(this)}>
                            <View style={styles.SettingButton}>
                                <Text style={styles.SettingButtonText}>{this.state.language.app_remover}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    // 退出登录
    onCloseLogin () {
        this.loadData()
    }
    async loadData () {
        try {
            AsyncStorage.removeItem('UserId')
            this.props.navigation.navigate('Login');
        }
        catch (e) {
            console.log(e);
        }
    }


    onEditTrade (title, component) {
        this.props.navigation.navigate(component, {name: title,})
    }
    renderList () {
        let list = [];
        let array = [
            {name: this.state.language.app_Stting_user, image: require('../../Image/user.png'), component: 'UserDetails'},
            {name: this.state.language.app_Stting_EditPwd, image: require('../../Image/xiugaimima.png'), component: 'EditPwd'},
            {name: this.state.language.app_EditTrade_title, image: require('../../Image/jiaoyiumima.png'), component: 'EditTrade'}
        ]
        array.forEach((v, i) => {
            list.push(
                <TouchableOpacity activeOpacity={0.8} key={i}
                                  onPress={this.onEditTrade.bind(this, v.name, v.component)}>
                    <View style={styles.cellList}>
                        <Image style={styles.cellListLeftImg} source={v.image}/>
                        <Text style={styles.cellListText}>{v.name}</Text>
                        <Image style={styles.cellListRightImg} source={require('../../Image/rightImage.png')}/>
                    </View>
                </TouchableOpacity>
            )
        })
        return list;
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    aboutUsMainList: {
        backgroundColor: '#eee'
    },
    // 内容
    cellList: {
        // height: 50,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#ececec',
        borderBottomWidth: 1,
    },
    cellListText: {
        paddingLeft: 10,
        flex: 1,
        fontSize: Utils.setSpText(16),
    },
    cellListRightImg: {
        width: 15,
        height: 15,
    },
    SettingButton: {
        marginTop: 30,
        marginRight: 10,
        marginLeft: 10,
        backgroundColor: '#ff6a03',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
    },
    SettingButtonText: {
        color: '#fff',
        fontSize: Utils.setSpText(15)
    },
    cellListLeftImg: {
        width: 20,
        height: 20,
    }
});

