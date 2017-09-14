class CloudDbNetworkCtrl {
    constructor ($stateParams, $translate, CloudDbActionService, CloudDbNetworkService, ControllerHelper) {
        this.$stateParams = $stateParams;
        this.$translate = $translate;
        this.CloudDbActionService = CloudDbActionService;
        this.CloudDbNetworkService = CloudDbNetworkService;
        this.ControllerHelper = ControllerHelper;

        this.projectId = this.$stateParams.projectId;
        this.instanceId = this.$stateParams.instanceId;

        this.networks = this.ControllerHelper.request.getArrayLoader({
            loaderFunction: () => this.CloudDbNetworkService.getNetworks(this.projectId, this.instanceId)
        });

        this.actions = {
            addNetwork: {
                text: this.$translate.instant("cloud_db_network_add"),
                callback: () => this.CloudDbActionService.showNetworkEditModal(this.projectId, this.instanceId).then(() => this.networks.load()),
                isAvailable: () => true
            },
            updateNetwork: {
                text: this.$translate.instant("common_edit"),
                callback: network => this.CloudDbActionService.showNetworkEditModal(this.projectId, this.instanceId, network.network).then(() => {
                    this.CloudDbNetworkService.getNetwork(this.projectId, this.instanceId, network.network)
                        .then(newNetwork => _.assign(network, newNetwork));
                }),
                isAvailable: () => true
            },
            deleteNetwork: {
                text: this.$translate.instant("common_delete"),
                callback: network => this.ControllerHelper.modal.showDeleteModal({
                    titleText: this.$translate.instant("cloud_db_network_delete_title"),
                    text: this.$translate.instant("cloud_db_network_delete_confirmation_message"),
                    onDelete: () => this.CloudDbNetworkService.deleteNetwork(this.projectId, this.instanceId, network.network).then(() => this.networks.load())
                }),
                isAvailable: () => true
            }
        };
    }

    $onInit () {
        this.networks.load();
    }

    getActionTemplate () {
        return `
            <cui-dropdown-menu>
                <cui-dropdown-menu-button>
                    <ng-include src="'app/ui-components/icons/button-action.html'"></ng-include>
                </cui-dropdown-menu-button>
                <cui-dropdown-menu-body>
                    <div class="oui-action-menu">
                        <div class="oui-action-menu__item oui-action-menu-item">
                            <div class="oui-action-menu-item__icon">
                                <i class="oui-icon oui-icon-pen_line"></i>
                            </div>
                            <button class="oui-button oui-button_link oui-action-menu-item__label"
                                type="button"
                                data-ng-disabled="!$ctrl.actions.updateNetwork.isAvailable()"
                                data-ng-bind="'common_edit' | translate"
                                data-ng-click="$ctrl.actions.updateNetwork.callback($row)"></button>
                        </div>
                        <div class="oui-action-menu__item oui-action-menu-item">
                            <div class="oui-action-menu-item__icon">
                                <i class="oui-icon oui-icon-trash_line"></i>
                            </div>
                            <button class="oui-button oui-button_link oui-action-menu-item__label"
                                type="button"
                                data-ng-bind="'common_delete' | translate"
                                data-ng-disabled="!$ctrl.actions.deleteNetwork.isAvailable()"
                                data-ng-click="$ctrl.actions.deleteNetwork.callback($row)"></button>
                        </div>
                    </div>
                </cui-dropdown-menu-body>
            </cui-dropdown-menu>`;
    }
}

angular.module("managerApp").controller("CloudDbNetworkCtrl", CloudDbNetworkCtrl);
