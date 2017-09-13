class CloudDbBackupService {
    constructor (ServiceHelper) {
        this.ServiceHelper = ServiceHelper;
    }

    addBackup (projectId, instanceId, data) {
        //cloud_db_backup_add_error
        return this.ServiceHelper.errorHandler("cloud_db_backup_add_error")({});
    }

    restoreBackup (projectId, instanceId, backupId) {
        //cloud_db_backup_restore_sucess
        return this.ServiceHelper.errorHandler("cloud_db_backup_restore_error")({});
    }

    deleteBackup (projectId, instanceId, backupId) {
        return this.ServiceHelper.errorHandler("cloud_db_backup_delete_error")({});
    }

    getBackup (projectId, instanceId, backupId) {
        return this.ServiceHelper.errorHandler("cloud_db_backup_loading_error")({});
    }

    getBackups (projectId, instanceId) {
        return this.ServiceHelper.errorHandler("cloud_db_backup_list_loading_error")({});
    }
}

angular.module("managerApp").service("CloudDbBackupService", CloudDbBackupService);
