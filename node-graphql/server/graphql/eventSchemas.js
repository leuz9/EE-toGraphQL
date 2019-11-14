var GraphQLSchema = require("graphql").GraphQLSchema;
var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLList = require("graphql").GraphQLList;
var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLNonNull = require("graphql").GraphQLNonNull;
var GraphQLID = require("graphql").GraphQLID;
var GraphQLString = require("graphql").GraphQLString;
var GraphQLInt = require("graphql").GraphQLInt;
var EventModel = require("../models/Event");

var eventType = new GraphQLObjectType({
  name: "event",
  fields: function() {
    return {
      _id: {
        type: GraphQLString
      },
      image: {
        type: GraphQLString
      },
      title: {
        type: GraphQLString
      },
      titleshort: {
        type: GraphQLString
      },
      description: {
        type: GraphQLString
      },
      place: {
        type: GraphQLString
      }
    };
  }
});

var queryType = new GraphQLObjectType({
  name: "Query",
  fields: function() {
    return {
      events: {
        type: new GraphQLList(eventType),
        resolve: function() {
          const events = EventModel.find().exec();
          if (!events) {
            throw new Error("Error");
          }
          return events;
        }
      },
      event: {
        type: eventType,
        args: {
          id: {
            name: "_id",
            type: GraphQLString
          }
        },
        resolve: function(root, params) {
          const eventDetails = EventModel.findById(params.id).exec();
          if (!eventDetails) {
            throw new Error("Error");
          }
          return eventDetails;
        }
      }
    };
  }
});

var mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: function() {
    return {
      addEvent: {
        type: eventType,
        args: {
          image: {
            type: new GraphQLNonNull(GraphQLString)
          },
          title: {
            type: new GraphQLNonNull(GraphQLString)
          },
          titleshort: {
            type: new GraphQLNonNull(GraphQLString)
          },
          description: {
            type: new GraphQLNonNull(GraphQLString)
          },
          place: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function(root, params) {
          const eventModel = new EventModel(params);
          const newEvent = eventModel.save();
          if (!newEvent) {
            throw new Error("Error");
          }
          return newEvent;
        }
      },
      updateEvent: {
        type: eventType,
        args: {
          id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLString)
          },
          image: {
            type: new GraphQLNonNull(GraphQLString)
          },
          title: {
            type: new GraphQLNonNull(GraphQLString)
          },
          titleshort: {
            type: new GraphQLNonNull(GraphQLString)
          },
          description: {
            type: new GraphQLNonNull(GraphQLString)
          },
          place: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, params) {
          return eventModel.findByIdAndUpdate(
            params.id,
            {
              image: params.image,
              title: params.title,
              titleshort: params.titleshort,
              description: params.description,
              place: params.place
            },
            function(err) {
              if (err) return next(err);
            }
          );
        }
      },
      removeEvent: {
        type: eventType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, params) {
          const remEvent = EventModel.findByIdAndRemove(params.id).exec();
          if (!remEvent) {
            throw new Error("Error");
          }
          return remEvent;
        }
      }
    };
  }
});

module.exports = new GraphQLSchema({query: queryType, mutation: mutation});