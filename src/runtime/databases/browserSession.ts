//---------------------------------------------------------------------
// Browser Session Database
//---------------------------------------------------------------------

import * as parser from "../parser";
import * as builder from "../builder";
import {InsertAction, SetAction} from "../actions";
import {Changes} from "../changes";
import {Evaluation, Database} from "../runtime";

interface BrowserClient {
  send(json: string);
}

export class BrowserEventDatabase extends Database {
  constructor() {
    super();
    if(global["examples"]["event.eve"]) {
      let {results, errors} = parser.parseDoc(global["examples"]["event.eve"], "event");
      if(errors && errors.length) console.error("EVENT ERRORS", errors);
      let {blocks, errors: buildErrors} = builder.buildDoc(results);
      if(buildErrors && buildErrors.length) console.error("EVENT ERRORS", buildErrors);
      this.blocks = blocks;
    }
  }
}

export class BrowserViewDatabase extends Database {
  constructor() {
    super();
    if(global["examples"]["view.eve"]) {
      let {results, errors} = parser.parseDoc(global["examples"]["view.eve"], "view");
      if(errors && errors.length) console.error("View DB Errors", errors);
      let {blocks, errors: buildErrors} = builder.buildDoc(results);
      if(buildErrors && buildErrors.length) console.error("View DB Errors", buildErrors);
      this.blocks = blocks;
    }
  }
}

export class BrowserEditorDatabase extends Database {
  constructor() {
    super();
    if(global["examples"]["editor.eve"]) {
      let {results, errors} = parser.parseDoc(global["examples"]["editor.eve"], "editor");
      if(errors && errors.length) console.error("Editor DB Errors", errors);
      let {blocks, errors: buildErrors} = builder.buildDoc(results);
      if(buildErrors && buildErrors.length) console.error("Editor DB Errors", buildErrors);
      this.blocks = blocks;
    }
  }
}

export class BrowserInspectorDatabase extends Database {
  constructor() {
    super();
    if(global["examples"]["inspector.eve"]) {
      let {results, errors} = parser.parseDoc(global["examples"]["inspector.eve"], "inspector");
      if(errors && errors.length) console.error("Inspector DB Errors", errors);
      let {blocks, errors: buildErrors} = builder.buildDoc(results);
      if(buildErrors && buildErrors.length) console.error("Inspector DB Errors", buildErrors);
      this.blocks = blocks;
    }
  }
}

export class BrowserSessionDatabase extends Database {
  client: BrowserClient;

  constructor(client: BrowserClient) {
    super();
    this.client = client;
  }

  onFixpoint(evaluation: Evaluation, changes: Changes) {
    super.onFixpoint(evaluation, changes);
    let name = evaluation.databaseToName(this);
    let result = changes.result({[name]: true});
    if(result.insert.length || result.remove.length) {
      this.client.send(JSON.stringify(result));
    }
  }

  unregister(evaluation: Evaluation) {
    console.log("UNREGISTERING!");
    let ix = this.evaluations.indexOf(evaluation);
    if(ix > -1) {
      this.evaluations.splice(ix, 1);
    }
    console.log("evals", this.evaluations);
    if(this.evaluations.length === 0) {
      console.log("TRIPLES", this.index.toTriples());
      this.client.send(JSON.stringify({type: "result", insert: [], remove: this.index.toTriples()}))
    }
  }
}
