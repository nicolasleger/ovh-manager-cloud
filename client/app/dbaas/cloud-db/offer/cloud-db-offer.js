angular.module("managerApp").config($stateProvider => {
    $stateProvider
        .state("dbaas.cloud-db.instance.offer", {
            url: "/offer",
            views: {
                cloudDbContent: {
                    template: '<div ui-view="cloudDbAdvancedParameter"><div>'
                }
            },
            translations: ["common", "dbaas/cloud-db", "dbaas/cloud-db/offer"]
        })
        .state("dbaas.cloud-db.instance.offer.update", {
            url: "/update",
            views: {
                cloudDbAdvancedParameter: {
                    templateUrl: "app/dbaas/cloud-db/offer/cloud-db-offer-edit.html",
                    controller: "CloudDbOfferEditCtrl",
                    controllerAs: "$ctrl"
                }
            },
            onEnter: CloudMessage => CloudMessage.flushMessages(),
            translations: ["common", "dbaas/cloud-db", "dbaas/cloud-db/offer"]
        });
});
