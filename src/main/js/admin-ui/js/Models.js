var UserModel, RoleModel, MenuModel, MenuTreeModel, ServiceModel, MailManagementModel, SystemLanguageModel, QuartzJobModel, TriggerModel;
define([
    'kendo/kendo.data.min', 'robe/Validations'], function () {

    UserModel = kendo.data.Model.define({
        id: "oid",
        fields: {
            oid: {
                editable: false,
                nullable: true,
                type: "string"
            },
            lastUpdated: {
                editable: true,
                nullable: true,
                type: "string"
            },
            name: {
                editable: true,
                nullable: false,
                type: "string",
                validation: getValidations("name", "Ad", true, false, 2, 50, "[A-Za-z]+")
            },
            surname: {
                editable: true,
                nullable: false,
                type: "string",
                validation: getValidations("surname", "Soyad", true, false, 2, 50, "[A-Za-z]+")
            },
            email: {
                editable: true,
                nullable: false,
                type: "string",
                validation: getValidations("email", "Eposta", true, true, 5, 50)
            },
            active: {
                type: "boolean"
            },
            roleOid: {
                editable: true,
                nullable: false
            },
            role: {}
        }
    });

    RoleModel = kendo.data.Model.define({
        id: "oid",
        fields: {
            oid: {
                editable: false,
                nullable: true
            },
            lastUpdated: {
                editable: false,
                nullable: true
            },
            name: {
                editable: true,
                nullable: false,
                validation: getValidations("name", "Ad", true, false, 2, 50, "[A-Za-z]+")
            },
            code: {
                editable: true,
                nullable: false,
                validation: getValidations("code", "Kod", true, false, 2, 20, "[A-Za-z]+")
            }
        }
    });

    MenuModel = kendo.data.Model.define({
        id: "oid",
        fields: {
            oid: {
                editable: false,
                nullable: true
            },
            lastUpdated: {
                editable: true,
                nullable: true
            },
            name: {
                editable: true,
                nullable: false,
                validation: getValidations("name", "Ad", true, false, 2, 50, "[A-Za-z]+")
            },
            code: {
                editable: true,
                nullable: false,
                validation: getValidations("code", "Kod", true, false, 2, 50, "[A-Za-z]+")
            }
        }
    });

    MenuTreeModel = {
        model: {
            id: "oid",
            fields: {
                oid: {
                    editable: false,
                    nullable: true
                },
                lastUpdated: {
                    editable: false,
                    nullable: true
                },
                name: {
                    editable: true,
                    nullable: false
                },
                code: {
                    editable: true,
                    nullable: false
                },
                children: {}
            },
            hasChildren: function (item) {
                return item.items != null;
            }
        }
    };


    ServiceModel = kendo.data.Model.define({
        id: "oid",
        fields: {
            oid: {
                editable: false,
                nullable: true
            },
            lastUpdated: {
                editable: false,
                nullable: true
            },
            path: {
                editable: true,
                nullable: true,
                validation: getValidations("code", "Kod", true, false, 1, 100)
            },
            method: {
                editable: true,
                nullable: false,
                validation: getValidations("code", "Kod", true, false, 1, 10, "[A-Z]+")
            }
        }
    });


    MailManagementModel = kendo.data.Model.define({
        id: "oid",
        fields: {
            oid: {
                editable: false,
                nullable: true
            },
            lang: {
                editable: true,
                nullable: false
            },
            code: {
                editable: true,
                nullable: false,
                validation: getValidations("code", "Kod", true, false, 0, 500, "[A-Za-z]+")
            },
            template: {
                editable: true,
                nullable: false
            }
        }
    });

    SystemLanguageModel = kendo.data.Model.define({
        id: "oid",
        fields: {
            oid: {
                editable: false,
                nullable: true
            },
            lastUpdated: {
                editable: false,
                nullable: true
            },
            code: {
                editable: true,
                nullable: false
            },
            name: {
                editable: true,
                nullable: false
            }
        }
    });

    QuartzJobModel = kendo.data.Model.define({
        id: "oid",
        fields: {
            oid: {
                editable: false,
                nullable: true,
                type: "string",
                hidden: true
            },
            schedulerName: {
                editable: false,
                nullable: true,
                type: "string"
            },
            jobClassName: {
                editable: false,
                nullable: true,
                type: "string"
            },
            description: {
                editable: false,
                nullable: true,
                type: "string"
            }
        }
    });

    TriggerModel = kendo.data.Model.define({
        id: "oid",
        fields: {
            oid: {
                editable: false,
                nullable: false,
                type: "string",
                hidden: true
            },
            jobId: {
                editable: true,
                nullable: true,
                type: "string",
                hidden: true
            },
            cronExpression: {
                editable: true,
                nullable: true,
                type: "string"
            },
            active: {
                editable: true,
                nullable: true,
                type: "boolean"
            },
            fireTime: {
                editable: true,
                nullable: true,
                type: "string"
            }
        }
    });


});

