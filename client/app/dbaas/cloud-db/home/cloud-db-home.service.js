class CloudDbHomeService {
    constructor ($q, CloudDbAdvancedParameterService, OvhApiCloudDb, ServiceHelper, SidebarMenu) {
        this.$q = $q;
        this.CloudDbAdvancedParameterService = CloudDbAdvancedParameterService;
        this.OvhApiCloudDb = OvhApiCloudDb;
        this.ServiceHelper = ServiceHelper;
        this.SidebarMenu = SidebarMenu;
    }

    getStatus (projectId, instanceId) {
        return this.ServiceHelper.errorHandler("cloud_db_home_status_loading_error")({});
    }

    getAccess (projectId, instanceId) {
        return this.ServiceHelper.errorHandler("cloud_db_home_access_loading_error")({});
    }

    getConfiguration (projectId, instanceId) {
        const promisesHash = {
            configuration: this.OvhApiCloudDb.StandardInstance().Lexi().get({ projectId, instanceId }).$promise,
            parameters: this.CloudDbAdvancedParameterService.getCurrentParameters(projectId, instanceId)
        };

        return this.$q.all(promisesHash)
            .then(response => ({
                displayName: response.configuration.name || response.configuration.id,
                offer: response.configuration.flavor,
                type: response.configuration.image,
                advancedParameters: response.parameters,
                region: "GRA1" // Replace by response.region.name once it's not mocked anymore.
            }))
            .catch(this.ServiceHelper.errorHandler("cloud_db_home_configuration_loading_error"));
    }

    getSubscription (projectId, instanceId) {
        return this.ServiceHelper.errorHandler("cloud_db_home_subscription_loading_error")({});
        /* return this.CloudDb.Lexi().getServiceInfos({ projectId })
            .$promise
            .catch(this.ServiceHelper.errorHandler("cloud_db_home_subscription_loading_error"));*/
    }

    updateName (projectId, instanceId, newName) {
        return this.ServiceHelper.errorHandler("cloud_db_name_change_error")({});
        /* return this.CloudDb.Lexi().edit({ projectId }, { name: newName })
            .$promise
            .then(response => {
                this.getConfiguration(projectId).then(configuration => this.changeMenuTitle(projectId, configuration.displayName || projectId));
                return response;
            })
            .catch(this.ServiceHelper.errorHandler("cloud_db_name_change_error"));*/
    }

    changeMenuTitle (projectId, instanceId, displayName) {
        const menuItem = this.SidebarMenu.getItemById(instanceId);
        if (menuItem) {
            menuItem.title = displayName;
        }
    }
}

angular.module("managerApp").service("CloudDbHomeService", CloudDbHomeService);
