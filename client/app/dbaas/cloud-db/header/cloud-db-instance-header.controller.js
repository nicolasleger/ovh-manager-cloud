class CloudDbInstanceHeaderCtrl {
    constructor ($stateParams, ControllerHelper, CloudDbHomeService, SidebarMenu) {
        this.$stateParams = $stateParams;
        this.ControllerHelper = ControllerHelper;
        this.CloudDbHomeService = CloudDbHomeService;
        this.SidebarMenu = SidebarMenu;

        this.projectId = $stateParams.projectId;
        this.instanceId = $stateParams.instanceId;

        //  No error handling since we don't want to break anything for a title.
        this.configuration = this.configuration = this.ControllerHelper.request.getHashLoader({
            loaderFunction: () => this.CloudDbHomeService.getConfiguration(this.projectId, this.instanceId),
            successHandler: () => { this.menuItem.title = this.configuration.data.displayName; }
        });
    }

    $onInit () {
        this.menuItem = this.SidebarMenu.getItemById(this.instanceId);

        //  If the menu is not yet loaded, we fetch IPLB's displayName.  Dirty patch.
        if (!this.menuItem) {
            this.menuItem = { title: this.instanceId };
            this.configuration.load();
        }
    }
}

angular.module("managerApp").controller("CloudDbInstanceHeaderCtrl", CloudDbInstanceHeaderCtrl);
