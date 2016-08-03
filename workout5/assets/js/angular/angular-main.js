angular.module('MyApp', [
	'ParentController',
	'CollapseDirective',
	'DatepickerDirective',
	'ValidationDirective',
	'LimitFilter'
])

.constant('COUNT_OBJECT', 4)
.constant('FORM_REQUIRED', {
	min_firstname: 3,
	max_firstname: 30,
	min_lastname: 3,
	max_lastname: 30,
	length_nationalcode: 10,
	min_fathername: 3,
	max_fathername: 30
})
.value('users', [
	{
		id: 0,
		firstname: 'pooya',
		lastname: 'azarpour',
		nationalcode: '0922427038',
		birthday: '1372/06/27',
		fathername: 'mohamad',
		info: ''
	},
	{
		id: 1,
		firstname: 'hamid',
		lastname: 'barati',
		nationalcode: '0934575894',
		birthday: '1371/08/26',
		fathername: 'nemidonam',
		info: 'English teacher'
	},
	{
		id: 2,
		firstname: 'ali',
		lastname: 'charghand',
		nationalcode: '0456897525',
		birthday: '1372/04/21',
		fathername: 'hasan',
		info: 'Learn and study in torbat univercity.'
	},
	{
		id: 3,
		firstname: 'mehran',
		lastname: 'armand',
		nationalcode: '0651813525',
		birthday: '1372/03/11',
		fathername: 'nemidonam',
		info: 'Baran group'
	}
]);

angular.module('ValidationDirective', [])

.directive('datepickerValidate', function() {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attr, ctrl) {
			function checkValidation(value) {
				var yy = value.substr(0,4);
				var mm = value.substr(5,2);
				var dd = value.substr(8,2);

				if((dd.length != 0 && dd < 32) && (mm.length != 0 && mm < 13) && (yy.length != 0 && yy > 1000)) {
					ctrl.$setValidity('validdate', true);
				} else {
					ctrl.$setValidity('validdate', false);
				}

				return value;
			}
			ctrl.$parsers.push(checkValidation);
		}
	};
});

angular.module('DatepickerDirective', [])

.directive('datepicker', function() {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attr, ctrl) {
			$(function() {
				element.datepicker({
					dateFormat:'yy/mm/dd',
					onSelect: function(date) {
						scope.$apply(function() {
							ctrl.$setViewValue(date);
						});
					}
				});
			});
		}
	}
});

angular.module('CollapseDirective', [])

.directive('collapse', function() {
	return {
		restrict: 'C',
		link: function(scope, element, attr, ctrl) {
			$(function() {
				element.collapse({toggle: false});
				element.prev().click(function(event) {
					element.collapse('toggle');
				});
			});
		}
	}
});

angular.module('LimitFilter', [])

.filter('limitItem', function() {
	return function(data, count, begin) {
		var item = [];
		var countUser = 0;

		if(typeof(data) !== 'undefined') {
			countUser = data.length;
			count = begin + count > countUser ? countUser : begin + count;
			for(var i = begin; i < count; i++) {
				item.push(data[i]);
			}

			return item;
		}
	};
});

angular.module('ParentController', [])

.controller('AddController', ['$rootScope', '$scope', '$element', 'FORM_REQUIRED', function($rootScope, $scope, $element, FORM_REQUIRED) {
	$scope.constant = {'form_required' : FORM_REQUIRED};
	$scope.showAdd = true;
	$scope.alert = {
		show: false,
		type: '',
		message: ''
	};

    var clearForm = function () {
        $scope.user.firstname = '';
        $scope.user.lastname = '';
        $scope.user.nationalcode = '';
        $scope.user.birthday = '';
        $scope.user.fathername = '';
        $scope.user.info = '';

        $scope.addUserForm.nationalcode.$error.exist = false;

        $scope.addUserForm.$setPristine();
        $scope.addUserForm.$setUntouched();
    };

    $element.find('form button.btn-warning').click(function() {
        $rootScope.$broadcast('unselectUser', true);
        $scope.$apply(function() {
            clearForm();
        });
    });

	$scope.$on('getUser', function(event, arg) {
		$scope.$apply(function() {
			$scope.user = arg;
			$scope.showAdd = false;
		});

		angular.element('body').animate({scrollTop: angular.element('form')[0].offsetTop - 30}, 600);
	});

	$scope.$on('errorForm', function(event, arg) {
		if(typeof(arg) === 'object') {
			if(arg.nationalcode && arg.nationalcode == 'exist') {
				$scope.addUserForm.nationalcode.$error.exist = true;
			}

			$scope.alert.show = true;
			$scope.alert.type = 'danger';
			$scope.alert.message = 'Please check fields and fix errors. Then try submit form.';
		}
	});

	$scope.$on('clearForm', function(event, arg) {
		clearForm();
	});

	$scope.submitUser = function() {
		$scope.addUserForm.$setPristine();
		$scope.addUserForm.$setUntouched();
		$scope.addUserForm.$invalid = false;

		var namePattern = /^[a-zA-Z]+$/;
		var numberPattern = /^\d+$/;
		var datePattern = /^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/;

		if(typeof($scope.user) === 'undefined') {
			$scope.user = {};
		}

		if(!$scope.user.firstname || $scope.user.firstname.length === 0 || !$scope.user.firstname.trim()) {
			$scope.addUserForm.firstname.$touched = true;
			$scope.addUserForm.firstname.$invalid = true;
			$scope.addUserForm.firstname.$error.required = true;
		} else if($scope.user.firstname.length < 3) {
			$scope.addUserForm.firstname.$error.minlength = true;
		} else if($scope.user.firstname.length > 30) {
			$scope.addUserForm.firstname.$error.maxlength = true;
		} else if(!namePattern.test($scope.user.firstname)) {
			$scope.addUserForm.firstname.$error.pattern = true;
		}

		if(!$scope.user.lastname || $scope.user.lastname.length === 0 || !$scope.user.lastname.trim()) {
			$scope.addUserForm.lastname.$touched = true;
			$scope.addUserForm.lastname.$invalid = true;
			$scope.addUserForm.lastname.$error.required = true;
		} else if($scope.user.lastname.length < 3) {
			$scope.addUserForm.lastname.$error.minlength = true;
		} else if($scope.user.lastname.length > 30) {
			$scope.addUserForm.lastname.$error.minlength = true;
		} else if(!namePattern.test($scope.user.lastname)) {
			$scope.addUserForm.lastname.$error.pattern = true;
		}

		if(!$scope.user.nationalcode || $scope.user.nationalcode.length === 0) {
			$scope.addUserForm.nationalcode.$touched = true;
			$scope.addUserForm.nationalcode.$invalid = true;
			$scope.addUserForm.nationalcode.$error.required = true;
		} else if(!numberPattern.test($scope.user.nationalcode)) {
			$scope.addUserForm.nationalcode.$error.pattern = true;
		} else if($scope.user.nationalcode.length != 10) {
			$scope.addUserForm.nationalcode.$error.minlength = true;
		}

		if(!$scope.user.birthday || $scope.user.birthday.length === 0) {
			$scope.addUserForm.birthday.$touched = true;
			$scope.addUserForm.birthday.$invalid = true;
			$scope.addUserForm.birthday.$error.required = true;
		} else if(!datePattern.test($scope.user.birthday)) {
			$scope.addUserForm.birthday.$error.pattern = true;
		} else {
			var dd = $scope.user.birthday.substr(0,2);
			var mm = $scope.user.birthday.substr(3,2);
			var yy = $scope.user.birthday.substr(6,4);
			if((dd.length != 0 && dd < 32) && (mm.length != 0 && mm < 13) && (yy.length != 0 && yy > 1000)) {
				$scope.addUserForm.birthday.$error.validdate = false;
			} else {
				$scope.addUserForm.birthday.$error.validdate = true;
			}
		}

		if(!$scope.user.fathername || $scope.user.fathername.length === 0 || !$scope.user.fathername.trim()) {
			$scope.addUserForm.fathername.$touched = true;
			$scope.addUserForm.fathername.$invalid = true;
			$scope.addUserForm.fathername.$error.required = true;
		} else if($scope.user.fathername.length < 3) {
			$scope.addUserForm.fathername.$error.minlength = true;
		} else if($scope.user.fathername.length > 30) {
			$scope.addUserForm.fathername.$error.maxlength = true;
		} else if(!namePattern.test($scope.user.fathername)) {
			$scope.addUserForm.fathername.$error.pattern = true;
		}

		if(Object.keys($scope.addUserForm.$error).length != 0) {
			$scope.addUserForm.$invalid = true;
		}

		if(!$scope.addUserForm.$invalid) {
			$scope.alert.show = true;
			$scope.alert.type = 'success';
			$scope.alert.message = 'Your user has been inserted.';
			$scope.showAdd = true;

			$rootScope.$broadcast('addUser', angular.copy($scope.user));
		} else {
			$scope.alert.show = true;
			$scope.alert.type = 'danger';
			$scope.alert.message = 'Please check fields and fix errors. Then try submit form.';
		}
	};
}])

.controller('ViewController', ['$rootScope', '$scope', '$window', '$element', 'users', 'COUNT_OBJECT', function($rootScope, $scope, $window, $element, users, COUNT_OBJECT) {
	$scope.users = [];
	$scope.uid = -1;
	$scope.countObject = COUNT_OBJECT;
	$scope.currentPage = 1;
	$scope.startLimit = 0;

	if(users.length != 0) {
		$scope.users = users;
	}

	var searchById = function(id) {
		var find = {};
		angular.forEach($scope.users, function(value, key) {
			if(value.id == id) {
				find = value;
				return;
			}
		});

		return find;
	};

    var getUserIndexById = function(id) {
        var find = -1;
        angular.forEach($scope.users, function(value, key) {
            if(value.id == id) {
                find = key;
                return;
            }
        });

        return find;
    };

	var existNationalCode = function(nationalCode) {
		var find = false;
		angular.forEach($scope.users, function(value, key) {
			if(value.nationalcode == nationalCode) {
				find = true;
				return;
			}
		});

		return find;
	};

	var unselectedUser = function() {
		$element.find('.btn-select-user[data-uid="' + $scope.uid + '"]').removeClass('btn-success').addClass('btn-primary').html('<i class="fa fa-external-link"></i> Select');
		$scope.uid = -1;
	};

    $scope.diving = Math.ceil($scope.users.length / COUNT_OBJECT);
    $scope.repeatNumber = function(num) {
        var number = [];
        for(var i = 1; i <= num; i++) {
            number.push(i);
        }

        return number;
    };

    $element.find('.pagination').on('click', 'a', function(event) {
        event.preventDefault();
		var element = angular.element(this);
		var numberPattern = /^\d+$/;
		var page = element.attr('data-page');

		if(typeof(page) != 'undefined' && numberPattern.test(page) && $scope.currentPage != page) {
			$scope.$apply(function() {
				$scope.currentPage = Number(page);
				$scope.startLimit = COUNT_OBJECT * ($scope.currentPage - 1);
			});
		}
    });

	$element.find('table').on('click', 'a', function(event) {
        event.preventDefault();
	});

	$element.find('table').on('click', 'button', function() {
		var element = angular.element(this);
		if($scope.uid == -1) {
			element.removeClass('btn-primary').html('<i class="fa fa-external-link"></i> Select');
			element.addClass('btn-success').html('<i class="fa fa-check"></i> Selected');
		} else if($scope.uid != element.attr('data-uid')) {
			$element.find('.btn-select-user[data-uid="' + $scope.uid + '"]').removeClass('btn-success').addClass('btn-primary').html('<i class="fa fa-external-link"></i> Select');
			element.addClass('btn-success').html('<i class="fa fa-check"></i> Selected');
		}

		$scope.uid = element.attr('data-uid');
		$rootScope.$broadcast('getUser', angular.copy(searchById($scope.uid)));
	});

    $scope.$on('unselectUser', function(event, arg) {
		unselectedUser()
    });

	$scope.$on('addUser', function(event, arg) {
		if(typeof(arg) != 'object') {
			arg = {};
		}

        if($scope.uid != -1) {
            var updateUser = getUserIndexById($scope.uid);

            $scope.users[updateUser].firstname = arg.firstname;
            $scope.users[updateUser].lastname = arg.lastname;
            $scope.users[updateUser].nationalcode = arg.nationalcode;
            $scope.users[updateUser].birthday = arg.birthday;
            $scope.users[updateUser].fathername = arg.fathername;
			$scope.users[updateUser].info = arg.info;

			$rootScope.$broadcast('clearForm', true);
			unselectedUser();
        } else {
            if(typeof(arg.nationalcode) != 'undefined' && existNationalCode(arg.nationalcode)) {
                $rootScope.$broadcast('errorForm', {
                    nationalcode: 'exist'
                });
            } else {
                var id = 0;
                if($scope.users.length > 0) {
                    id = $scope.users[$scope.users.length - 1].id + 1;
                }
                angular.extend(arg, {id: id});
                $scope.users.push(arg);


                $rootScope.$broadcast('clearForm', true);

				$scope.diving = Math.ceil($scope.users.length / COUNT_OBJECT);
            }
        }
	});
}]);
