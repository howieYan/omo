import React, { Component } from 'react';
import Home from './Home';
import Login from './Components/Login'// 登录
import Registered from './Components/Registered'; //注册
import PrivacyPolicy from './Components/PrivacyPolicy'; // 隐私条款
import ForgotPassword from './Components/ForgotPassword'; // 忘记密码
import ContractThePurse from './Nav/List/ContractThePurse'; // 合约钱包
import CalculateForceWallet from './Nav/List/CalculateForceWallet'; // 算力钱包
import TheWalletOperation from './Nav/TheWalletOperation/TheWalletOperation'; // 钱包操作
import HashRate from './Nav/HashRate/HashRate'; // 算力操作
import HashTurnCoin from './Nav/HashRate/Component/HashTurnCoin'; // 算力操作转币
import HashRecord from './Nav/HashRate/Component/HashRecord'; // 算力操作转币记录
import Contract from './Nav/Contract/Contract'; // 合约操作
import ContractTurnCoin from './Nav/Contract/Component/ContractTurnCoin'; // 合约操作转币
import ContractRecord from './Nav/Contract/Component/ContractRecord'; // 合约操作记录
import TeamManagement from './Nav/TeamManagement/TeamManagement'; // 团队管理
import MessageCenter from './Nav/MessageCenter/MessageCenter'; // 消息中心
import MessageDetails from './Nav/MessageCenter/MessageDetails'; // 消息详情
import AboutUs from './Nav/AboutUs/AboutUs'; // 关于我们
import Agreement from './Nav/AboutUs/Component/Agreement'; // 使用协议
import PrivacyPlokicy from './Nav/AboutUs/Component/PrivacyPlokicy'; // 隐私条款
import OnlineMessage from './Nav/AboutUs/Component/OnlineMessage'; // 在线留言
import FileDownload from './Nav/FileDownload/FileDownload'; // 文件下载
import TheAnnouncement from './Nav/TheAnnouncement/TheAnnouncement'; // 公告
import TheAnnouncementDetails from './Nav/TheAnnouncement/TheAnnouncementDetails'; // 公告详情
import SetUpThe from './Nav/SetUpThe/SetUpThe'; // 设置
import UserDetails from './Nav/SetUpThe/Component/UserDetails'; // 个人信息
import EditPwd from './Nav/SetUpThe/Component/EditPwd'; // 修改密码
import EditTrade from './Nav/SetUpThe/Component/EditTrade'; // 修改交易密码
import Photo from './Nav/Photo/Photo'; // 修改头像
import { createAppContainer, createStackNavigator, SafeAreaView, DrawerItems
} from 'react-navigation';

export default function configAppNavigator(isLoggedIn, language) {
    const AppNavigator = createStackNavigator(
        {
            Home: {
                screen: Home,
                navigationOptions: {
                    header: null,
                    headerBackTitle: null,
                }
            },
            // 登录
            Login: {
                screen: Login,
                navigationOptions: {
                    header: null,
                    headerBackTitle: null,
                }
            },
            // 注册
            Registered: {
                screen: Registered,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 隐私条款
            PrivacyPolicy: {
                screen: PrivacyPolicy,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 忘记密码
            ForgotPassword: {
                screen: ForgotPassword,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 合约钱包
            ContractThePurse: {
                screen: ContractThePurse,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 算力钱包
            CalculateForceWallet: {
                screen: CalculateForceWallet,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 钱包操作
            TheWalletOperation: {
                screen: TheWalletOperation,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 算力操作
            HashRate: {
                screen: HashRate,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 合约操作
            Contract: {
                screen: Contract,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 算力操作转币
            HashTurnCoin: {
                screen: HashTurnCoin,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 算力操作转币记录
            HashRecord: {
                screen: HashRecord,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 合约操作转币
            ContractTurnCoin: {
                screen: ContractTurnCoin,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 合约操作记录
            ContractRecord: {
                screen: ContractRecord,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            //  团队管理
            TeamManagement: {
                screen: TeamManagement,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 消息中心
            MessageCenter: {
                screen: MessageCenter,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 消息详情
            MessageDetails: {
                screen: MessageDetails,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 关于我们
            AboutUs: {
                screen: AboutUs,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 使用协议
            Agreement: {
                screen: Agreement,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 隐私条款
            PrivacyPlokicy: {
                screen: PrivacyPlokicy,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 在线留言
            OnlineMessage: {
                screen: OnlineMessage,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 文件下载
            FileDownload: {
                screen: FileDownload,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 公告
            TheAnnouncement: {
                screen: TheAnnouncement,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 公告详情
            TheAnnouncementDetails: {
                screen: TheAnnouncementDetails,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 设置
            SetUpThe: {
                screen: SetUpThe,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 个人信息
            UserDetails: {
                screen: UserDetails,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 修改密码
            EditPwd: {
                screen: EditPwd,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 修改交易密码
            EditTrade: {
                screen: EditTrade,
                navigationOptions: {
                    headerBackTitle: null,
                }
            },
            // 修改头像
            Photo: {
                screen: Photo,
                navigationOptions: {
                    headerBackTitle: null,
                }
            }
        },
        {
            initialRouteName: isLoggedIn ? 'Home' : 'Login',
            navigationOptions: {
                headerTintColor: '#333333',
                showIcon: true,
                gesturesEnabled: false,
            },
        }
    )
    return createAppContainer(AppNavigator);
}

