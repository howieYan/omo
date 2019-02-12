import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image, TouchableOpacity, AsyncStorage
} from 'react-native';
import Utils from "../../Components/Utils";
export default class TheWalletOperation extends Component {
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
            list: {},
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
            {title: this.state.language.app_Home_profit, img: require('../../Image/rightImage.png'), component: 'HashRate'},
            {title: this.state.language.app_Home_capital, img: require('../../Image/rightImage.png'), component: 'Contract'},
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
        this.props.navigation.navigate(record, {name: title,})
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    contentBg: {
        backgroundColor: '#ccc',
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
