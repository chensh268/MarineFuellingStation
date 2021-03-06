﻿import ComponentBase from "../../ComponentBase";
import axios from "axios";
import moment from "moment";
import { Component } from 'vue-property-decorator';

@Component
export default class ClientComponent extends ComponentBase {
    model: server.client;
    modelCompany: server.company;
    companys: server.company[];
    clients: server.client[];
    searchClients: server.client[];
    products: server.product[];

    sales: work.userlist[];
    companyName: string;

    oiloptions: ydui.actionSheetItem[];
    menuoptions: ydui.actionSheetItem[];
    oilName: string = '请选择';

    radio1: string = "2";
    radio2: string = "1";
    oilshow: boolean = false;
    menushow: boolean = false;
    nonshow: boolean = false;
    showMyClients: boolean = false;
    showSearchInput: boolean = false;
    showSearchResult: boolean = false;
    show1: boolean = false;
    show2: boolean = false;
    iswater: boolean = true;
    isAddAction: boolean = true;
    showCompanys: boolean = false;
    showCompanyInput: boolean = false;
    showsales: boolean = false;
    labelBoatOrCar: string = "";
    svCompany: string = "";
    svCompany1: string = "";
    svClient: string = "";
    svClient1: string = "";
    selectClientIds: number[];
    selectClientIds1: Array<number>;

    actBtnId: number; actBtnId1: number; actBtnId2: number; actBtnId3: number;//当前激活状态的条件button
    ctype: server.clientType; ptype: server.salesPlanState; balances: number; cycle: number;

    filterCType: Array<helper.filterBtn>; filterPType: Array<helper.filterBtn>; filterBalances: Array<helper.filterBtn>; filterCycle: Array<helper.filterBtn>;
    activedBtnId: number;

    page: number;
    scrollRef: any;
    pSize: number = 30;

    constructor() {
        super();

        this.oiloptions = new Array();
        
        this.model = (new Object()) as server.client;
        this.modelCompany = (new Object()) as server.company;
        this.clients = new Array<server.client>();
        this.companys = new Array<server.company>();
        this.sales = new Array<work.userlist>();
        this.model.placeType = server.placeType.水上;
        this.model.clientType = server.clientType.个人;
        this.model.followSalesman = '请选择';
        this.model.maxOnAccount = 0;
        this.model.carNo = '';
        this.model.contact = '';
        this.model.phone = '';
        this.model.mobile = '';

        this.selectClientIds = new Array<number>();
        this.selectClientIds1 = new Array<number>();
        
        this.labelBoatOrCar = "船号";
        this.getOilProducts();
        this.companyName = '请选择';
        this.getCompanys('');
        this.getSales();
        
        
        this.filterCType = [
            { id: 0, name: '全部', value: server.clientType.全部, actived: true },
            { id: 1, name: '个人', value: server.clientType.个人, actived: false },
            { id: 2, name: '公司', value: server.clientType.公司, actived: false }
        ];
        this.filterPType = [
            { name: '已计划', value: server.salesPlanState.未审批, actived: false },
            { name: '已完成', value: server.salesPlanState.已完成, actived: false },
            { name: '已审批', value: server.salesPlanState.已审批, actived: false }
        ];
        this.filterBalances = [
            { name: '少于1000', value: 1000, actived: false },
            { name: '少于10000', value: 10000, actived: false }
        ]
        this.filterCycle = [
            { name: '7天不计划', value: 7, actived: false },
            { name: '15天不计划', value: 15, actived: false },
            { name: '30天不计划', value: 30, actived: false },
            { name: '90天不计划', value: 90, actived: false }
        ]

        
        this.actBtnId = 0; this.actBtnId1 = -1; this.actBtnId2 = -1; this.actBtnId3 = -1;
    }

    switchBtn(o: helper.filterBtn, idx: number, group: string) {
        switch (group) {
            case "客户类型":
                if (idx != this.actBtnId) {
                    o.actived = true;
                    this.ctype = <server.clientType>o.value;
                    this.filterCType[this.actBtnId].actived = false;
                    this.actBtnId = idx;
                }
                break;
            case "计划单":
                o.actived = !o.actived;
                this.ptype = <server.salesPlanState>o.value;
                if (idx != this.actBtnId1 && this.actBtnId1 != -1) {
                    this.filterPType[this.actBtnId1].actived = false;
                    this.actBtnId1 = idx;
                }
                else
                    this.actBtnId1 = idx;
                break;
            case "账户余额":
                o.actived = !o.actived;
                this.balances = <number>o.value;
                if (idx != this.actBtnId2 && this.actBtnId2 != -1) {
                    this.filterBalances[this.actBtnId2].actived = false;
                    this.actBtnId2 = idx;
                }
                else
                    this.actBtnId2 = idx;
                break;
            case "周期":
                o.actived = !o.actived;
                this.cycle = <number>o.value;
                if (idx != this.actBtnId3 && this.actBtnId3 != -1) {
                    this.filterCycle[this.actBtnId3].actived = false;
                    this.actBtnId3 = idx;
                }
                else
                    this.actBtnId3 = idx;
                break;
        }
        if (o.actived) {
            this.page = 1;
            this.getClients();
        }
    }

    filterclick(): void {
        this.show2 = false;
        this.page = 1;
        this.getClients();
    };

    mounted() {
        this.$emit('setTitle', '客户');
        this.$watch('model.clientType', (v, ov) => {
            switch (parseInt(v)) {
                case server.clientType.个人:
                    this.companyName = "";
                    this.show1 = false;
                    break;
                case server.clientType.公司:
                    this.show1 = true;
                    break;
            }
        });
        this.$watch('model.placeType', (v, ov) => {
            switch (parseInt(v)) {
                case server.placeType.陆上:
                    this.labelBoatOrCar = "车牌号"
                    break;
                case server.placeType.水上:
                    this.labelBoatOrCar = "船号"
                    break;
            }
        });
        this.$watch("svClient", (v: string, ov) => {
            //2个字符开始才执行请求操作，减少请求次数
            if (v.length >= 2 || v.length == 0) {
                this.page = 1;
                this.getClients();
            }
        });
        this.$watch("svCompany", (v: string, ov) => {
            if (v.length >= 2)
                this.getCompanys(v);
        });
        this.$watch("svCompany1", (v: string, ov) => {
            if (v.length >= 2)
                this.getCompanys(v);
        });
    };

    loadList() {
        this.getClients((list: server.client[]) => {
            this.clients = this.page > 1 ? [...this.clients, ...list] : this.clients;
            this.scrollRef = (<any>this).$refs.infinitescroll;
            if (list.length < this.pSize) {
                this.scrollRef.$emit("ydui.infinitescroll.loadedDone");
                return;
            }

            //通知加载数据完毕
            this.scrollRef.$emit("ydui.infinitescroll.finishLoad");

            if (list.length > 0)
                this.page++;
            else
                this.page = 1;
            console.log("page = " + this.page)
        });
    }

    switchaddcompany() {
        this.modelCompany = new Object as server.company;
        this.showCompanys = false;
        this.isAddAction = true;
        this.showCompanyInput = true;
    }

    change(label: string, tabkey: string) {
        console.log(label);
        if (label == "客户列表") {
            this.page = 1;
            this.getClients();
        }
    }

    companyclick(c: server.company) {
        this.modelCompany = c;
        this.menushow = true;
        this.menuoptions = [{
            label: '详细资料',
            callback: () => {
                this.isAddAction = false;//切换编辑标识
                this.showCompanyInput = true;
            }
        },{
            label: '客户成员',
            callback: () => {
                this.showMyClients = true;
            }
        }];
    }

    selectcompanyclick(company: server.company) {
        this.companyName = company.name;
        this.model.companyId = company.id;
        this.showCompanys = false;
    }

    selectsalesclick(sales: work.userlist) {
        this.model.followSalesman = sales.name;
        this.showsales = false;
    }

    godetail(c: server.client) {
        this.$router.push('/client/client/' + c.id);
    }

    //提交新增公司
    addcompanyclick() {
        if (this.modelCompany.name == '' || this.modelCompany.name == null) {
            this.toastError("名称不能为空");
            return;
        }
        
        this.postCompany(this.modelCompany);
    }
    //提交新增客户
    addclientclick() {
        let $model = this.model;
        if ($model.carNo == "" || $model.carNo == null) {
            this.toastError("请输入" + this.labelBoatOrCar);
            return;
        }
        if ($model.followSalesman == "请选择" || $model.followSalesman == null) {
            this.toastError("请选择跟进销售人员");
            return;
        }
        if ($model.defaultProductId == 0 || $model.defaultProductId == null) {
            this.toastError("请选择默认商品");
            return;
        }
        if ($model.contact == "" || $model.contact == null) {
            this.toastError("请输入联系人");
            return;
        }
        if ($model.mobile == "" || $model.mobile == null) {
            this.toastError("请输入联系电话");
            return;
        }
        if ($model.maxOnAccount == "")
            $model.maxOnAccount = 0;
        $model.name = $model.clientType == server.clientType.公司 ? "个人" : this.companyName;
        console.log($model);
        this.postClient($model);
    }

    //后台提交
    //新增公司
    postCompany(model: server.company) {
        axios.post('/api/Company', model).then((res) => {
            let jobj = res.data as server.resultJSON<server.company>;
            if (jobj.code == 0) {
                this.modelCompany.name = '';
                this.toastSuccess('操作成功');
                this.modelCompany = new Object as server.company;
                this.getCompanys('');
            }
            else
                this.toastError(jobj.msg);
        });
    }
    //新增客户
    postClient(model: server.client) {
        axios.post('/api/Client', model).then((res) => {
            let jobj = res.data as server.resultJSON<server.client>;
            if (jobj.code == 0) {
                this.toastSuccess('操作成功')
            }
            else
                this.toastError(jobj.msg);
        });
    }
    //获得公司列表
    getCompanys(kw: string) {
        axios.get('/api/Company/' + kw).then((res) => {
            let jobj = res.data as server.resultJSON<server.company[]>;
            if (jobj.code == 0)
                this.companys = jobj.data;
            else
                this.toastError('无法获取公司数据，请重试')
        });
    }
    //获得商品列表
    getOilProducts() {
        axios.get('/api/Product/OilProducts').then((res) => {
            let jobj = res.data as server.resultJSON<server.product[]>;
            if (jobj.code == 0) {
                jobj.data.forEach((o, i) => {
                    this.oiloptions.push({
                        label: o.name,
                        callback: () => {
                            this.oilName = o.name;
                            this.model.defaultProductId = o.id;
                        }
                    });
                });
            }
        });
    }
    //获得我的客户列表
    getClients(callback?: Function) {
        if (this.ctype == null) this.ctype = server.clientType.全部;
        if (this.ptype == null) this.ptype = -1;//-1标识没有选择任何项
        if (this.balances == null) this.balances = -1;
        if (this.cycle == null) this.cycle = -1;
        if (this.svClient == null) this.svClient = "";
        if (this.page == null) this.page = 1;
        if (this.pSize == null) this.pSize = 30;

        axios.get('/api/Client/GetClients'
            + '?ctype=' + this.ctype.toString()
            + '&ptype=' + this.ptype.toString()
            + '&balances=' + this.balances.toString()
            + '&cycle=' + this.cycle.toString()
            + '&kw=' + this.svClient
            + '&isMy=false'
            + '&page=' + this.page
            + '&pageSize=' + this.pSize
        ).then((res) => {
            let jobj = res.data as server.resultJSON<server.client[]>;
            if (jobj.code == 0) {
                if (callback) {
                    callback(jobj.data);
                }
                else {
                    this.clients = jobj.data;
                    console.log(this.clients);
                    this.page++;
                }
            }
            else
                this.toastError('无法获取客户数据，请重试')
        });
    }
    //搜索船或车 船号|车号|手机|联系人
    getClientsByKw() {
        axios.get('/api/Client/GetByClientKeyword?'
            + 'kw=' + this.svClient1
        ).then((res) => {
            let jobj = res.data as server.resultJSON<server.client[]>;
            if (jobj.code == 0) {
                if (jobj.data == null || jobj.data.length == 0)
                    this.toastError("没有找到相关数据")
                else {
                    this.searchClients = new Array<server.client>();
                    this.searchClients = jobj.data;
                    this.showSearchResult = true;
                }
            }
            else
                this.toastError('无法获取客户数据，请重试')
        });
    }
    //获得销售员
    getSales() {
        axios.get('/api/User/Salesman').then((res) => {
            let jobj = res.data as work.tagMemberResult;
            if (jobj.errcode == 0)
                this.sales = jobj.userlist;
        });
    }
    //添加成员
    putAddCompanyClients() {
        console.log(this.selectClientIds1);
        axios.put('/api/Client/SetClientsToCompany'
            + '?clientIds=' + this.selectClientIds1
            + '&companyId=' + this.modelCompany.id
            , null).then((res) => {
                let jobj = res.data as server.resultJSON<server.client[]>;
                if (jobj.code == 0) {
                    this.toastSuccess('操作成功');
                    jobj.data.forEach((c, idx) => {
                        this.modelCompany.clients.push(c);
                        this.selectClientIds1 = new Array();
                    });
                    this.showSearchResult = false;
                    this.showSearchInput = false;
                }
                else
                    this.toastError(jobj.msg);
            });
    }
    //移除成员
    putRemoveCompanyClients() {
        console.log(this.selectClientIds1);
        axios.put('/api/Client/RemoveCompanyClients'
            + '?clientIds=' + this.selectClientIds
            + '&companyId=' + this.modelCompany.id
            , null).then((res) => {
                let jobj = res.data as server.resultJSON<server.client[]>;
                if (jobj.code == 0) {
                    this.toastSuccess('操作成功');
                    this.modelCompany.clients = jobj.data;
                    this.selectClientIds = new Array();
                    this.showMyClients = false;
                }
                else
                    this.toastError(jobj.msg);
            });
    }
}