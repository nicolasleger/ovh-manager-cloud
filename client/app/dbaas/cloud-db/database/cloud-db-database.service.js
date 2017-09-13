class CloudDbDatabaseService {
    constructor (ServiceHelper) {
        this.ServiceHelper = ServiceHelper;
    }

    addDatabase (projectId, instanceId, data) {
        return this.ServiceHelper.errorHandler("cloud_db_database_add_error")({});
    }

    saveDatabase (projectId, instanceId, databaseId, data) {
        return this.ServiceHelper.errorHandler("cloud_db_database_update_error")({});
    }

    deleteDatabase (projectId, instanceId, databaseId) {
        return this.ServiceHelper.errorHandler("cloud_db_database_delete_error")({});
    }

    getDatabase (projectId, instanceId, databaseId) {
        return this.ServiceHelper.errorHandler("cloud_db_database_loading_error")({});
    }

    getDatabases (projectId, instanceId) {
        return this.ServiceHelper.errorHandler("cloud_db_database_list_loading_error")({});
    }
}

angular.module("managerApp").service("CloudDbDatabaseService", CloudDbDatabaseService);
