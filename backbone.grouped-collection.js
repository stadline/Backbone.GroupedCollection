var _ = require('underscore');
var Backbone = require('backbone');
var VirtualCollection = require('backbone-virtual-collection');

var GroupedCollection = Backbone.GroupedCollection = function (parent, options) {
    if (options.groupBy === undefined) {
        throw "groupBy option must be defined";
    }

    // convert string group criteria to functions
    var getGroupValue = _.isFunction(options.groupBy) ? options.groupBy : function (model) {
        return model.get(options.groupBy);
    };

    // grouping function
    var createGroup = function (models, groupId) {
        var modelComparator = models[0].collection ? models[0].collection.comparator : null;

        var group = new Backbone.Model({
            id: groupId,
            collection: new VirtualCollection(parent, {
                filter: function (model) {
                    return getGroupValue(model) == groupId;
                },
                comparator: modelComparator
            })
        });

        group.on('remove', function () {
            group.get('collection').stopListening();
        });

        return group;
    };

    // comparator function
    var groupComparator = function(groupA, groupB) {
        if (groupA.id < groupB.id) {
            return -1;
        } else if (groupA.id > groupB.id) {
            return 1;
        } else {
            return 0;
        }
    };

    // initialize collection
    var groups = _.map(parent.groupBy(getGroupValue), createGroup);
    var collection = new Backbone.Collection(groups, {
        comparator: function(a, b) {
            var sortOrder = ('' + options.sortOrder).toUpperCase();

            if (sortOrder == 'ASC') {
                return groupComparator(a, b);
            } else if (sortOrder == 'DESC') {
                return -1 * groupComparator(a, b);
            } else {
                return 0;
            }
        }
    });

    // propage update events
    parent.on("filter update", function () {
        var filteredGroups = _.map(parent.groupBy(getGroupValue), createGroup);

        collection.set(filteredGroups, {add: true, remove: true, merge: false});
    });

    return collection;
};

module.exports = GroupedCollection;