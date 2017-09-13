class CloudDbHomeService {
    constructor ($q, /*CloudDb,*/ ServiceHelper, SidebarMenu) {
        this.$q = $q;
        //this.CloudDb = CloudDb;
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
        return this.ServiceHelper.errorHandler("cloud_db_home_configuration_loading_error")({});
        /* return this.CloudDb.Lexi().get({ projectId })
            .$promise
            .then(response => {
                response.displayName = response.name || projectId;
                return response;
            })
            .catch(this.ServiceHelper.errorHandler("cloud_db_home_configuration_loading_error"));*/
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
