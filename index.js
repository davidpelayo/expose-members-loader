/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author David Pelayo @ddpelayo
	Extended expose-loader created by Tobias Koppers @sokra
*/

function getMultipleExposers(query) {
	var exposers;

	if (typeof query !== 'string' || !query.length) {
		return query;
	}

	exposers = query.split(',');
	return exposers;
}

function accesorString(value) {
	var childProperties = value.split("."),
			length = childProperties.length,
			propertyString = "global",
			result = "",
			i;

	for(i = 0; i < length; i++) {
		if(i > 0) {
			result += "if(!" + propertyString + ") " + propertyString + " = {};\n";
		}
		propertyString += "[" + JSON.stringify(childProperties[i]) + "]";
	}

	result += "module.exports = " + propertyString;
	return result;
}

function getAccesorMemberString(request, exposers, index, member) {
	return accesorString(exposers[index]) + " = " +
			"require(" + JSON.stringify("-!" + request) + ")." + member + ";";
}

function getAccesorString(request, exposer) {
	return accesorString(exposer) + " = " +
			"require(" + JSON.stringify("-!" + request) + ");";
}

module.exports = function() {};
module.exports.pitch = function(remainingRequest) {
	var exposers = getMultipleExposers(this.query.substr(1)),
			exposingString = '';

	this.cacheable && this.cacheable();

	if (!this.query) {
		throw new Error('Query parameter is missing');
	}

	if (this.query.indexOf(' ') > -1) {
		throw new Error('You must get rid of spaces');
	}

	if (exposers.length > 1) {
		for (var i = 0, len = exposers.length; i < len; i++) {
			var namespacedExposers = exposers[i].split('.');

			if (namespacedExposers.length > 0) {
				/*
					remainingRequest,
					exposers from the initial request, like ?a.x.y.z,b,c
					i -> current exposer [a.x.y.z, b, c]
					namespacedExposers[namespacedExposers.length - 1] -> z

					result: global.a.x.y.z = request().z;
				*/
				exposingString += getAccesorMemberString(remainingRequest, exposers, i, namespacedExposers[namespacedExposers.length - 1]) + '\n';
			} else {
				exposingString += getAccesorMemberString(remainingRequest, exposers, i, exposers[i]) + '\n';
			}
		}
	} else {
		exposingString = getAccesorString(remainingRequest, exposers[0]);
	}

	return exposingString;
};
