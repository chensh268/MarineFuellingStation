﻿<template>
    <div id="root">
        <div id="root">
            <yd-cell-group>
                <yd-cell-item>
                    <span slot="left">所属公司：</span>
                    <span slot="right">{{model.company != null? model.company.name : ""}}</span>
                </yd-cell-item>

                <yd-cell-item>
                    <span slot="left">船号/车号</span>
                    <span slot="right">{{model.carNo}}</span>
                </yd-cell-item>

                <yd-cell-item>
                    <span slot="left">默认商品：</span>
                    <span slot="right">{{model.product != null? model.product.name : ""}}</span>
                </yd-cell-item>

                <yd-cell-item>
                    <span slot="left">联系人：</span>
                    <span slot="right">{{model.contact}}</span>
                </yd-cell-item>

                <yd-cell-item>
                    <span slot="left">联系电话：</span>
                    <span slot="right">{{model.mobile}}</span>
                </yd-cell-item>

            </yd-cell-group>
            <yd-cell-group title="其他信息">

                <yd-cell-item>
                    <span slot="left">身份证号：</span>
                    <span slot="right">{{model.idCard}}</span>
                </yd-cell-item>

                <yd-cell-item>
                    <span slot="left">地址：</span>
                    <span slot="right">{{model.address}}</span>
                </yd-cell-item>

                <yd-cell-item>
                    <span slot="left">固定电话：</span>
                    <span slot="right">{{model.phone}}</span>
                </yd-cell-item>

            </yd-cell-group>

            <yd-cell-group title="设置（选填）">
                <yd-cell-item>
                    <span slot="left">最高挂账金额：</span>
                    <span slot="right">{{model.maxOnAccount}}</span>
                </yd-cell-item>
            </yd-cell-group>
            <yd-button size="large" @click.native="authApplyclick" :disabled="isLeader == 0">批准申请</yd-button>
        </div>
    </div>
</template>

<script src="./applytomyclient.ts" />

