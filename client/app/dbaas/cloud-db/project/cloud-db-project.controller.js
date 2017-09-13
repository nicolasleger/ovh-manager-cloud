class CloudDbProjectCtrl {
    constructor ($state, $stateParams, $translate, CloudDbProjectService, ControllerHelper) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$translate = $translate;
        this.CloudDbProjectService = CloudDbProjectService;
        this.ControllerHelper = ControllerHelper;

        this.projectId = this.$stateParams.projectId;

        this.initActions();
        this.initLoaders();
    }

    $onInit () {
        this.instances.load();
        this.configuration.load();
        this.subscription.load();
    }

    initLoaders () {
        this.instances = this.ControllerHelper.request.getArrayLoader({
            loaderFunction: () => this.CloudDbProjectService.getInstances(this.projectId)
        });

        this.configuration = this.ControllerHelper.request.getHashLoader({
            loaderFunction: () => this.CloudDbProjectService.getConfiguration(this.projectId)
        });

        this.subscription = this.ControllerHelper.request.getHashLoader({
            loaderFunction: () => this.CloudDbProjectService.getSubscription(this.projectId)
        });
    }

    initActions () {
        this.actions = {
            addInstance: {
                text: this.$translate.instant("cloud_db_project_instance_add"),
                state: "dbaas.cloud-db.project.add",
                stateParams: { projectId: this.projectId },
                isAvailable: () => true
            },
            goToInstance: {
                text: this.$translate.instant("cloud_db_project_instance_add"),
                callback: instance => this.$state.go("dbaas.cloud-db.instance.home", { projectId: this.projectId, instanceId: instance.id }),
                isAvailable: () => true
            },
            //TODO : DO SOMETHING HERE
            rebootInstance: {
                text: this.$translate.instant("common_delete"),
                callback: instance => this.ControllerHelper.modal.showDeleteModal({
                    titleText: this.$translate.instant("cloud_db_project_instance_delete_title"),
                    text: this.$translate.instant("cloud_db_project_instance_delete_confirmation_message"),
                    onDelete: () => this.CloudDbProjectService.rebootInstance(this.projectId, instance.id)
                }),
                isAvailable: () => false
            },
            deleteInstance: {
                text: this.$translate.instant("common_delete"),
                callback: instance => this.ControllerHelper.modal.showDeleteModal({
                    titleText: this.$translate.instant("cloud_db_project_instance_delete_title"),
                    text: this.$translate.instant("cloud_db_project_instance_delete_confirmation_message"),
                    onDelete: () => this.CloudDbProjectService.deleteInstance(this.projectId, instance.id)
                }),
                isAvailable: () => true
            },
            editName: {
                text: this.$translate.instant("common_edit"),
                callback: () => this.ControllerHelper.modal.showNameChangeModal({
                    serviceName: this.projectId,
                    displayName: this.configuration.data.displayName,
                    onSave: newDisplayName => this.CloudDbProjectService.updateName(this.projectId, newDisplayName)
                }),
                isAvailable: () => true
            },
            manageAutorenew: {
                text: this.$translate.instant("common_manage"),
                href: this.ControllerHelper.navigation.getUrl("renew", { projectId: this.projectId, serviceType: "CLOUD_DB" }),
                isAvailable: () => true
            },
            manageContact: {
                text: this.$translate.instant("common_manage"),
                href: this.ControllerHelper.navigation.getUrl("contacts", { projectId: this.projectId }),
                isAvailable: () => true
            }
        };
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
                                <i class="oui-icon oui-icon-eye"></i>
                            </div>
                            <button class="oui-button oui-button_link oui-action-menu-item__label"
                                type="button"
                                data-ng-bind="$ctrl.actions.goToInstance.text"
                                data-ng-disabled="!$ctrl.actions.goToInstance.isAvailable()"
                                data-ng-click="$ctrl.actions.goToInstance.callback($row)"></button>
                        </div>
                    </div>
                    <div class="oui-action-menu">
                        <div class="oui-action-menu__item oui-action-menu-item">
                            <div class="oui-action-menu-item__icon">
                                <i class="oui-icon oui-icon-pen_line"></i>
                            </div>
                            <button class="oui-button oui-button_link oui-action-menu-item__label"
                                type="button"
                                data-ng-disabled="!$ctrl.actions.updateUser.isAvailable()"
                                data-ng-bind="'common_edit' | translate"
                                data-ng-click="$ctrl.actions.updateUser.callback(123456)"></button>
                        </div>
                        <div class="oui-action-menu__item oui-action-menu-item">
                            <div class="oui-action-menu-item__icon">
                                <i class="oui-icon oui-icon-trash_line"></i>
                            </div>
                            <button class="oui-button oui-button_link oui-action-menu-item__label"
                                type="button"
                                data-ng-bind="'common_delete' | translate"
                                data-ng-disabled="!$ctrl.actions.deleteUser.isAvailable()"
                                data-ng-click="$ctrl.actions.deleteUser.callback(123456)"></button>
                        </div>
                    </div>
                </cui-dropdown-menu-body>
            </cui-dropdown-menu>`;
    }
}

angular.module("managerApp").controller("CloudDbProjectCtrl", CloudDbProjectCtrl);
