define([
    'text!./MenuManagement.html',
    './MenuDataSource',
    './MenuTreeModel',
    'kendo/kendo.grid.min',
    'kendo/kendo.window.min',
    'kendo/kendo.treeview.min',
    'robe/view/RobeView'
], function (view, MenuDataSource, MenuTreeModel) {

    var MenuManagementView = require('robe/view/RobeView').define({
        name: "MenuManagementView",
        html: view,
        containerId: "container",

        initialize: function () {
            i18n.init("MenuManagement");

            $("#gridMenus").kendoGrid({
                dataSource: MenuDataSource.get(),
                sortable: true,
                resizable: true,
                pageable: {
                    refresh: true
                },
                toolbar: [{
                    name: "create",
                    text: "Yeni Menü".i18n()
                }],
                columns: [{
                    field: "name",
                    title: "Ad".i18n(),
                    width: "110px"
                }, {
                    field: "code",
                    title: "Kod".i18n(),
                    width: "110px"
                },{
                    field: "itemOrder",
                    title: "Sıra".i18n(),
                    width: "30px"
                }, {
                    command: [{
                        name: "edit",
                        text: {
                            edit: "",
                            update: "Güncelle".i18n(),
                            cancel: "İptal".i18n()
                        },
                        className: "grid-command-iconfix"
                    }, {
                        name: "destroy",
                        text: "",
                        className: "grid-command-iconfix"
                    }],
                    title: "&nbsp;",
                    width: "80px"
                }],
                group: {
                    field: "parentOid",
                    aggregates: [{
                        field: "oid",
                        aggregate: "count"
                    }]
                },
                editable: {
                    mode: "popup",
                    window: {
                        title: "Kayıt".i18n()
                    },
                    confirmation: "Silmek istediğinizden emin misiniz?".i18n(),
                    confirmDelete: "Yes"
                }
            });

            refreshTree(null);

            $("#treeMenus").kendoTreeView({
                dragAndDrop: true,
                dataTextField: "name",
                drop: onTreeMenuDrop
            });

            $("#btnRefreshMenuTree").kendoButton({
                click: refreshTree
            });


            function refreshTree(e) {
                $.ajax({
                    type: "GET",
                    url: AdminApp.getBackendURL() + "menu/roots",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        var dataSource = new kendo.data.HierarchicalDataSource({
                            data: response,
                            schema: MenuTreeModel
                        });
                        $("#treeMenus").data("kendoTreeView").setDataSource(dataSource);
                        if (e != null) {
                            showToast("success", "Yenileme Başarılı".i18n());
                        }
                    }
                });
            }

            function onTreeMenuDrop(e) {
                console.log(e.statusClass);

                if (!e.valid) {
                    return;
                }
                var treeview = $("#treeMenus").data("kendoTreeView");
                var sourceItem = treeview.dataItem(e.sourceNode);
                //over, before, or after.
                var destinationItem  = treeview.dataItem(e.destinationNode);

                if (e.dropPosition == "over") {

                    $.ajax({
                        type: "POST",
                        url: AdminApp.getBackendURL() + "menu/movenode/" + sourceItem.oid + "/" + destinationItem.oid,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        success: function () {
                            showToast("success", "Başarıyla Güncellendi".i18n());
                        }
                    });
                } else {
                    var order =  destinationItem.itemOrder;
                    if(e.dropPosition == "before"){
                        order--;
                    }else{
                        order++;
                    }
                    sourceItem.itemOrder = order;
                    delete sourceItem.index;
                    $.ajax({
                        type: "POST",
                        url: AdminApp.getBackendURL() + "menu",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        data: kendo.stringify(sourceItem),
                        success: function () {
                            showToast("success", "Başarıyla Güncellendi".i18n());
                            MenuDataSource.get();

                        }
                    });


                }

            };
            i18n.translate();
        }
    });

    return MenuManagementView;
});