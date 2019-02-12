import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated, ScrollView, InteractionManager, AsyncStorage,
} from 'react-native';
import Utils from "../../Components/Utils";
import ScrollableTabView, {DefaultTabBar,ScrollableTabBar} from 'react-native-scrollable-tab-view';
import One from './component/One';
import Two from './component/Two';
export default class TeamManagement extends React.Component {
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
            index: null,
            language: {},
        };
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
            this.props.navigation.setParams({title: this.state.language.app_nav_name_Team})
        }
        catch (e) {
            console.log(e);
        }
    }
    render() {
        return (
            <View style={styles.content}>
                <ScrollableTabView
                    initialPage={0}
                    tabBarBackgroundColor='#000'
                    renderTabBar={() => <DefaultTabBar/>}
                    // onChangeTab={(obj) => {this.setState({index: obj.i})}}
                    tabBarUnderlineStyle={styles.lineStyle}
                    tabBarInactiveTextColor='#fff'
                    tabBarActiveTextColor='#fff'>
                    <One style={styles.content} tabLabel={this.state.language.app_Team_title_left}/>
                    <Two style={styles.content} tabLabel={this.state.language.app_Team_title_right}/>
                </ScrollableTabView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#E9E9ED'
    },
    // 内容
    lineStyle: {
        height: 2,
        backgroundColor: '#fff',
    },
});

