﻿//------------------------------------------------------------------------------
// <auto-generated>
//     此代码由工具生成。
//     运行时版本:4.0.30319.42000
//
//     对此文件的更改可能会导致不正确的行为，并且如果
//     重新生成代码，这些更改将会丢失。
// </auto-generated>
//------------------------------------------------------------------------------

namespace 打印终端.Properties {
    
    
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.VisualStudio.Editors.SettingsDesigner.SettingsSingleFileGenerator", "15.3.0.0")]
    internal sealed partial class Settings : global::System.Configuration.ApplicationSettingsBase {
        
        private static Settings defaultInstance = ((Settings)(global::System.Configuration.ApplicationSettingsBase.Synchronized(new Settings())));
        
        public static Settings Default {
            get {
                return defaultInstance;
            }
        }
        
        [global::System.Configuration.UserScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.DefaultSettingValueAttribute("https://vue.car0774.com/hubs/print")]
        public string baseAddress {
            get {
                return ((string)(this["baseAddress"]));
            }
            set {
                this["baseAddress"] = value;
            }
        }
        
        [global::System.Configuration.UserScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.DefaultSettingValueAttribute("dbd.docx")]
        public string PrintOrderDocx {
            get {
                return ((string)(this["PrintOrderDocx"]));
            }
            set {
                this["PrintOrderDocx"] = value;
            }
        }
        
        [global::System.Configuration.UserScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.DefaultSettingValueAttribute("unload.docx")]
        public string PrintUnloadDocx {
            get {
                return ((string)(this["PrintUnloadDocx"]));
            }
            set {
                this["PrintUnloadDocx"] = value;
            }
        }
        
        [global::System.Configuration.UserScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.DefaultSettingValueAttribute("生产转仓单.docx")]
        public string PrintMoveStoreDocx {
            get {
                return ((string)(this["PrintMoveStoreDocx"]));
            }
            set {
                this["PrintMoveStoreDocx"] = value;
            }
        }
        
        [global::System.Configuration.UserScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.DefaultSettingValueAttribute("收银台")]
        public string ClientId {
            get {
                return ((string)(this["ClientId"]));
            }
            set {
                this["ClientId"] = value;
            }
        }
        
        [global::System.Configuration.UserScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.DefaultSettingValueAttribute("船舶清污完工证.docx")]
        public string PrintBoatCleanDocx {
            get {
                return ((string)(this["PrintBoatCleanDocx"]));
            }
            set {
                this["PrintBoatCleanDocx"] = value;
            }
        }
        
        [global::System.Configuration.UserScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.DefaultSettingValueAttribute("船舶清污完工证收款单.docx")]
        public string PrintBoatCleanCollectionDocx {
            get {
                return ((string)(this["PrintBoatCleanCollectionDocx"]));
            }
            set {
                this["PrintBoatCleanCollectionDocx"] = value;
            }
        }
        
        [global::System.Configuration.UserScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.DefaultSettingValueAttribute("陆上装车单.docx")]
        public string PrintLoadOilDocx {
            get {
                return ((string)(this["PrintLoadOilDocx"]));
            }
            set {
                this["PrintLoadOilDocx"] = value;
            }
        }
        
        [global::System.Configuration.UserScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.DefaultSettingValueAttribute("预收款确认单.docx")]
        public string PrintPrepaymentDocx {
            get {
                return ((string)(this["PrintPrepaymentDocx"]));
            }
            set {
                this["PrintPrepaymentDocx"] = value;
            }
        }
        
        [global::System.Configuration.UserScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.DefaultSettingValueAttribute("卸车石化过磅单.docx")]
        public string PrintUnloadDocx1 {
            get {
                return ((string)(this["PrintUnloadDocx1"]));
            }
            set {
                this["PrintUnloadDocx1"] = value;
            }
        }
    }
}
