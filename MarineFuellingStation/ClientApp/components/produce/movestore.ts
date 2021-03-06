﻿import ComponentBase from "../../ComponentBase";
import { Component } from 'vue-property-decorator';
import axios from "axios";

@Component
export default class MoveStoreComponent extends ComponentBase {
    model: server.moveStore;
    movestores: server.moveStore[];
    manufacturer: work.userlist[];
    picked: string[];
    outStores: server.store[];
    inStores: server.store[];
    selectedOutStore: number | string = '';
    selectedInStore: number | string = '';

    stypeFrom: helper.filterBtn[];
    stypeTo: helper.filterBtn[];
    actBtnId: number; actBtnId1: number;

    radio2: string = "1";
    carNo: string = "";
    showManuUsers: boolean = false;
    isPrevent: boolean = true;
    isPrevent1: boolean = true;

    sv: string = "";
    page: number;
    scrollRef: any;
    pSize: number = 30;

    selectproducerclick(): void {
        this.model.manufacturer = this.picked.join('|');
        this.showManuUsers = false;
    };

    constructor() {
        super();

        this.movestores = new Array<server.moveStore>();
        this.picked = new Array<string>();
        this.model = (new Object()) as server.moveStore;
        this.model.name = '';
        this.model.manufacturer = this.$store.state.username;//应客户要求，暂时取消生产员勾选，默认操作用户
        this.inStores = new Array<server.store>();
        this.outStores = new Array<server.store>();
        this.manufacturer = new Array<work.userlist>();

        this.stypeFrom = new Array<helper.filterBtn>();
        this.stypeTo = new Array<helper.filterBtn>();
        this.actBtnId = -1;
        this.actBtnId1 = -1;

        this.getStoreTypes();
        this.getMoveStoreNo();
        //this.getManufacturer();
    }

    loadList() {
        this.getMoveStores((list: server.moveStore[]) => {
            this.movestores = this.page > 1 ? [...this.movestores, ...list] : this.movestores;
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

    buttonclick() {
        //信息验证
        this.postMoveStore(this.model);
    }

    mounted() {
        this.$emit('setTitle', this.$store.state.username + ' 生产开单');
        this.$watch('sv', (v: string, ov) => {
            //2个字符开始才执行请求操作，减少请求次数
            if (v.length >= 2 || v == "")
                this.getMoveStores();
        });
    };

    change(label: string, tabkey: string) {
        console.log(label);
        this.page = 1;
        this.movestores = null;
        (<any>this).$refs.infinitescroll.$emit('ydui.infinitescroll.reInit');
        if (label == "记录") {
            this.getMoveStores();
        }
    }

    switchBtn(o: helper.filterBtn, idx: number, group: string) {
        switch (group) {
            case "转出仓":
                if (o.value) this.getOutStores(parseInt(o.value.toString()));
                o.actived = true;
                this.model.outStoreTypeId = parseInt(o.value.toString());
                if (idx != this.actBtnId && this.actBtnId != -1) {
                    this.stypeFrom[this.actBtnId].actived = false;
                    this.actBtnId = idx;
                }
                else
                    this.actBtnId = idx;
                break;
            case "转入仓":
                if (o.value) this.getInStores(parseInt(o.value.toString()));
                o.actived = true;
                this.model.inStoreTypeId = parseInt(o.value.toString());
                if (idx != this.actBtnId1 && this.actBtnId1 != -1) {
                    this.stypeTo[this.actBtnId1].actived = false;
                    this.actBtnId1 = idx;
                }
                else
                    this.actBtnId1 = idx;
                break;
        }
    }

    addNextConfirm() {
        let that = this;
        this.$dialog.confirm({
            title: '操作成功',
            mes: '操作成功，是否继续开单？',
            opts: () => {
                window.location.reload();
            }
        });
    }

    validate() {
        if (!this.model.outStoreId) {this.toastError("请指定转出仓");return false;}
        if (!this.model.inStoreId) { this.toastError("请指定转入仓");return false;}
        if (this.model.outStoreId == this.model.inStoreId) { this.toastError("转出仓和转入仓不能相同"); return false; }
        if (this.model.inDensity == null) { this.toastError("请输入进仓密度"); return false; }
        if (this.model.outDensity == null) { this.toastError("请输入出仓密度"); return false; }
        if (this.model.inDensity >= 1) { this.toastError("进仓密度应少于1"); return false; }
        if (this.model.outDensity >= 1) { this.toastError("出仓密度应少于1"); return false; }
        //if (!this.model.manufacturer) {
        //    this.toastError("请指定生产员")
        //    return;
        //}
        return true;
        
    }

    getMoveStoreNo() {
        axios.get('/api/MoveStore/MoveStoreNo').then((res) => {
            let jobj = res.data as server.resultJSON<string>;
            if (jobj.code == 0) {
                this.model.name = jobj.data;
                this.isPrevent = false;
            }
        });
    }
    //** 获得生产员 */
    getManufacturer() {
        axios.get('/api/User/Manufacturer').then((res) => {
            let jobj = res.data as work.tagMemberResult;
            if (jobj.errcode == 0)
                this.manufacturer = jobj.userlist;
        });
    }

    getOutStores(stype: number) {
        axios.get('/api/Store/GetByStoreType?stypeId=' + stype.toString()).then((res) => {
            let jobj = res.data as server.resultJSON<server.store[]>;
            if (jobj.code == 0)
                this.outStores = jobj.data;
        });
    }

    getInStores(stype: number) {
        axios.get('/api/Store/GetByStoreType?stypeId=' + stype.toString()).then((res) => {
            let jobj = res.data as server.resultJSON<server.store[]>;
            if (jobj.code == 0)
                this.inStores = jobj.data;
        });
    }

    getStoreTypes() {
        axios.get('/api/StoreType').then((res) => {
            let jobj = res.data as server.resultJSON<server.storeType[]>;
            if (jobj.code == 0) {
                jobj.data.forEach((st, idx) => {
                    this.stypeFrom.push({
                        id: idx,
                        name: st.name,
                        value: st.id,
                        actived: false
                    });
                    this.stypeTo.push({
                        id: idx,
                        name: st.name,
                        value: st.id,
                        actived: false
                    });
                });
                this.isPrevent1 = false;
            }
        });
    }

    getMoveStores(callback?: Function) {
        if (this.page == null) this.page = 1;
        if (this.pSize == null) this.pSize = 30;
        axios.get('/api/MoveStore/GetByPager?page='
            + this.page
            + '&pagesize=' + this.pSize
            + '&sv=' + this.sv)
            .then((res) => {
                let jobj = res.data as server.resultJSON<server.moveStore[]>;
                if (jobj.code == 0) {
                    if (callback) {
                        callback(jobj.data);
                    }
                    else {
                        this.movestores = jobj.data;
                        this.page++;
                    }
                }
            });
    }

    postMoveStore(model: server.moveStore) {
        model.inStoreId = this.selectedInStore;
        model.outStoreId = <number>this.selectedOutStore;
        if (!this.validate()) return;
        axios.post('/api/MoveStore', model).then((res) => {
            let jobj = res.data as server.resultJSON<server.moveStore>;
            if (jobj.code == 0) {
                //this.isPrevent = true;
                this.addNextConfirm();
            }
        });
    }
}