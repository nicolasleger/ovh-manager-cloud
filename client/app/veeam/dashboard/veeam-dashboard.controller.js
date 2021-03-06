(() => {
    class VeeamDashboardCtrl {
        constructor ($stateParams, $translate, VeeamService, ControllerHelper, REDIRECT_URLS) {
            this.$stateParams = $stateParams;
            this.$translate = $translate;
            this.VeeamService = VeeamService;
            this.ControllerHelper = ControllerHelper;

            this.serviceName = this.$stateParams.serviceName;

            this.urls = {
                renew: REDIRECT_URLS.renew
                                .replace("{serviceType}", "VEEAM_CLOUD_CONNECT")
                                .replace("{serviceName}", this.$stateParams.serviceName)
            };

            this.initLoaders();
        }

        initLoaders () {
            const errorHandler = response => this.VeeamService.unitOfWork.messages.push({
                text: response.message,
                type: "error"
            });

            this.configurationInfos = this.ControllerHelper.request.getHashLoader({
                loaderFunction: () => this.VeeamService.getConfigurationInfos(this.serviceName),
                errorHandler
            });

            this.subscriptionInfos = this.ControllerHelper.request.getHashLoader({
                loaderFunction: () => this.VeeamService.getSubscriptionInfos(this.serviceName),
                successHandler: () => {
                    if (this.subscriptionInfos.data.isOnTrial) {
                        let message = this.$translate.instant("veeam_tiles_subscription_label_renewal_warning", { remainingDays: this.subscriptionInfos.data.subscriptionTimeRemaining });
                        if (this.subscriptionInfos.data.subscriptionTimeRemaining < 0) {
                            message = this.$translate.instant("veeam_message_product_disabled");
                        }

                        this.VeeamService.unitOfWork.messages.push({
                            text: message,
                            type: this.subscriptionInfos.data.subscriptionTimeRemaining < 0 ? "error" : "warning",
                            link: {
                                type: "action",
                                text: this.$translate.instant("veeam_tiles_subscription_label_renewal_warning_link"),
                                action: () => this.changeOffer()
                            }
                        });
                    }
                },
                errorHandler
            });

            this.actions = this.ControllerHelper.request.getArrayLoader({
                loaderFunction: () => this.VeeamService.getActions(this.$stateParams.serviceName)
            });

            this.orderableOffers = this.ControllerHelper.request.getArrayLoader({
                loaderFunction: () => this.VeeamService.getOrderableOffers(this.serviceName),
                errorHandler
            });
        }

        $onInit () {
            this.configurationInfos.load();
            this.subscriptionInfos.load();
            this.actions.load();
            this.orderableOffers.load();
        }

        addStorage () {
            if (this.actions.data.addStorage.available) {
                this.ControllerHelper.modal.showModal({
                    modalConfig: {
                        templateUrl: "app/veeam/storage/add/veeam-storage-add.html",
                        controller: "VeeamStorageAddCtrl",
                        controllerAs: "VeeamStorageAddCtrl",
                        resolve: {
                            serviceName: () => this.serviceName
                        }
                    },
                    successHandler: result => {
                        this.VeeamService.startPolling(this.$stateParams.serviceName, result.data);
                    },
                    errorHandler: err => this.VeeamService.unitOfWork.messages.push({
                        text: err.message,
                        type: "error"
                    })
                });
            } else {
                this.ControllerHelper.modal.showWarningModal({
                    title: this.$translate.instant("common_action_unavailable"),
                    message: this.actions.data.addStorage.reason
                });
            }
        }

        changeOffer () {
            if (this.actions.data.upgradeOffer.available) {
                this.ControllerHelper.modal.showModal({
                    modalConfig: {
                        templateUrl: "app/veeam/dashboard/update-offer/veeam-update-offer.html",
                        controller: "VeeamUpdateOfferCtrl",
                        controllerAs: "VeeamUpdateOfferCtrl",
                        resolve: {
                            serviceName: () => this.serviceName
                        }
                    },
                    successHandler: result => {
                        this.VeeamService.unitOfWork.messages.push({
                            textHtml: result.message,
                            type: "success"
                        });
                    },
                    errorHandler: err => this.VeeamService.unitOfWork.messages.push({
                        text: err.message,
                        type: "error"
                    })
                });
            } else {
                this.ControllerHelper.modal.showWarningModal({
                    title: this.$translate.instant("common_action_unavailable"),
                    message: this.actions.data.upgradeOffer.reason
                });
            }
        }
    }

    angular.module("managerApp").controller("VeeamDashboardCtrl", VeeamDashboardCtrl);
})();
