angular.module("managerApp").config($stateProvider => {
    $stateProvider
        .state("dbaas.cloud-db", {
            url: "/cloud-db",
            templateUrl: "app/dbaas/cloud-db/cloud-db.html",
            translations: ["common", "dbaas/cloud-db"]
        })
        .state("dbaas.cloud-db.instance", {
            url: "/{projectId}/instance/{instanceId}",
            redirectTo: "dbaas.cloud-db.instance.home",
            views: {
                cloudDbHeaderContainer: {
                    templateUrl: "app/dbaas/cloud-db/header/cloud-db-instance-header.html",
                    controller: "CloudDbInstanceHeaderCtrl",
                    controllerAs: "$ctrl"
                },
                cloudDbContainer: {
                    templateUrl: "app/dbaas/cloud-db/cloud-db-detail.html",
                    controller: "CloudDbDetailCtrl",
                    controllerAs: "$ctrl"
                }
            },
            translations: ["common", "cloud", "dbaas/cloud-db"]
        });
});
