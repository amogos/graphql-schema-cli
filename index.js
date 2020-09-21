let graphql = require("graphql");
var fs = require("fs");
let axios = require("axios");

let { printSchema, buildClientSchema, introspectionQuery } = graphql;

let inputParameters = {};

process.argv.forEach((val, index) => {
  let argument = val.split("=");
  if (argument.length > 1) {
    if (argument[0].indexOf("url") !== -1) {
      inputParameters.url = argument[1];
    }
    if (argument[0].indexOf("path") !== -1) {
      inputParameters.path = argument[1];
    }
  }
});

axios({
  url: inputParameters.url,
  method: "post",
  "Content-Type": "application/json",
  data: {
    operationName: "IntrospectionQuery",
    query: introspectionQuery
  }
})
  .then(({ data }) => {
    const schema = buildClientSchema(data.data);
    fs.writeFile(inputParameters.path, printSchema(schema), err => {
      if (err) {
        console.log(err);
      }
    });
  })
  .catch(e => console.log(e));
