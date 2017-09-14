class CloudDbAdvancedParameterEditCtrl {
    constructor ($state, $stateParams, CloudDbAdvancedParameterService, CloudDbProjectService, CloudNavigation, ControllerHelper) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.CloudDbAdvancedParameterService = CloudDbAdvancedParameterService;
        this.CloudNavigation = CloudNavigation;
        this.ControllerHelper = ControllerHelper;

        this.projectId = $stateParams.projectId;
        this.instanceId = $stateParams.instanceId;

        this.initialValues = {};
        this.model = {};

        this.parameters = this.ControllerHelper.request.getHashLoader({
            loaderFunction: () => this.CloudDbAdvancedParameterService.getCurrentParameters(this.projectId, this.instanceId),
            successHandler: () => this.buildModel()
        });
    }

    $onInit () {
        this.parameters.load();

        this.previousState = this.CloudNavigation.getPreviousState();
    }

    update () {
        const parameters = [];
        _.forEach(_.keys(this.model), key => {
            if (this.model[key] !== this.initialValues[key]) {
                parameters.push({ key, value: this.model[key] });
            }
        });

        this.CloudDbAdvancedParameterService.updateCurrentParameters(this.projectId, this.instanceId, { parameters })
            .then(() => this.$state.$go(this.previousState.state, this.previousState.stateParams));
    }

    buildModel () {
        _.forEach(this.parameters.data.details, param => {
            this.model[param.key] = param.value;
        });
        this.initialValues = _.clone(this.model);
    }
}

angular.module("managerApp").controller("CloudDbAdvancedParameterEditCtrl", CloudDbAdvancedParameterEditCtrl);
