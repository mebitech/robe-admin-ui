define([
    'text!./UserManagement.html',
    './UserDataSource',
    '../RoleManagement/RoleDataSource',
    'kendo/kendo.grid.min',
    'kendo/kendo.window.min',
    'robe/view/RobeView'
], function (html, UserDataSource, RoleDataSource) {
    var UserManagementView = require('robe/view/RobeView').define({
        name: "UserManagementView",
        html: html,
        containerId: "container",
        initialize: function () {

            i18n.init("UserManagement");

            var emailUserRegisterWindow = $("#emailUserRegister").kendoWindow({
                width: 260,
                modal: true,
                height: 180,
                resizable: false,
                title: "Kayıt için mail giriniz".i18n()
            }).data("kendoWindow");


            var roleDropdown = $("#user-role-register")
                .kendoDropDownList({
                    autoBind: false,
                    dataTextField: "name",
                    dataValueField: "oid",
                    text: "Seçiniz...".i18n(),
                    dataSource: RoleDataSource.get(),
                    placeholder: "Seçiniz...".i18n(),
                    index: -1
                }).data("kendoDropDownList");


            $("#gridUsers").kendoGrid({
                dataSource: UserDataSource.get(),
                sortable: true,
                autoBind: false,
                pageable: {
                    refresh: true
                },
                toolbar: [
                    {
                        name: "create",
                        text: "Yeni Kullanıcı".i18n()
                    },
                    {
                        name: "email-request",
                        text: "Email ile kayıt yap".i18n(),
                        imageClass: "k-icon k-i-pencil"
                    }
                ],
                columns: [
                    {
                        field: "name",
                        title: "Ad".i18n()

                    },
                    {
                        field: "surname",
                        title: "Soyad".i18n()
                    },
                    {
                        field: "email",
                        title: "E-posta".i18n()
                    },
                    {
                        field: "roleOid",
                        title: "Rol".i18n(),
                        editor: userRoleDropDownEditor,
                        hidden: true
                    },
                    {
                        field: "active",
                        title: "Aktif mi?".i18n(),
                        template: function (model) {
                            return (model.active) ? 'Evet'.i18n() : 'Hayır'.i18n();
                        }
                    },
                    {
                        command: [
                            {
                                name: "edit",
                                text: {
                                    edit: "",
                                    update: "Güncelle".i18n(),
                                    cancel: "İptal".i18n()
                                },
                                className: "grid-command-iconfix"
                            },
                            {
                                name: "destroy",
                                text: "",
                                className: "grid-command-iconfix"
                            }
                        ],
                        title: "&nbsp;",
                        width: "80px"
                    }
                ],
                editable: {
                    mode: "popup",
                    window: {
                        title: "Kayıt".i18n()
                    },
                    confirmation: "Silmek istediğinizden emin misiniz?".i18n(),
                    confirmDelete: "Yes"
                }
            });


            $(".k-grid-email-request", "#gridUsers").bind("click", function (ev) {
                var alert = $("#alert");
                alert.removeClass("k-block k-error-colored");
                alert.html("");
                $("#user-email-register").val("");
                roleDropdown.value("");
                emailUserRegisterWindow.center().open();
            });

            function validateEmail(email) {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }

            $("#user-email-register-update").bind("click", function (ev) {
                var email = $("#user-email-register").val();
                var alert = $("#alert");
                var roleOid = roleDropdown.value();
                if (!validateEmail(email)) {
                    alert.html("Mail adresi geçerli değil".i18n());
                    alert.addClass("k-block k-error-colored");
                    alert.show();
                    return;
                }
                if (!roleOid) {
                    alert.html("Lütfen rol Seçiniz".i18n());
                    alert.addClass("k-block k-error-colored");
                    alert.show();
                    return;
                }

                $.ajax({
                    type: "POST",
                    url: AdminApp.getBackendURL() + "user/emailRequest",
                    data: {
                        email: email,
                        roleOid: roleDropdown.value()
                    },
                    success: function (response) {
                        showToast("success", "Mail başarıyla gönderildi".i18n());
                        emailUserRegisterWindow.close();

                    },
                    error: function (request) {
                        emailUserRegisterWindow.close();
                    }
                });

            });
            $("#user-email-register-cancel").bind("click", function (ev) {
                emailUserRegisterWindow.close();
            });


            function userRoleDropDownEditor(container, options) {
                $('<input required data-required-msg="Rol alanı gerekli."  data-text-field="name" data-value-field="oid"  data-bind="value:' + options.field + '"/>')
                    .appendTo(container)
                    .kendoDropDownList({
                        autoBind: false,
                        dataTextField: "name",
                        dataValueField: "oid",
                        text: "Seçiniz...".i18n(),
                        dataSource: RoleDataSource.get(),
                        placeholder: "Seçiniz...".i18n(),
                        optionLabel: "Seçiniz...".i18n()
                    });
            };

            i18n.translate();


        }
    });


    return UserManagementView;
});