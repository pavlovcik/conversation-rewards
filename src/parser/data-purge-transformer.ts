import configuration from "../configuration/config-reader";
import { GetActivity } from "../get-activity";
import { GitHubIssueComment } from "../github-types";
import { Result, Transformer } from "./processor";

/**
 * Removes the data in the comments that we do not want to be processed.
 */
export class DataPurgeTransformer implements Transformer {
  readonly configuration = configuration["data-purge"];

  get enabled(): boolean {
    return this.configuration.enabled;
  }

  transform(data: Readonly<GetActivity>, result: Result): Result {
    for (const value of Object.values(data.comments as GitHubIssueComment[])) {
      if (value.body) {
        value.body = value.body
          .replace(/^>.*$/gm, "")
          .replace(/[\r\n]+/g, " ")
          .replace(/\[.*?\]\(.*?\)/g, "")
          .replace(/^\/\S+/g, "")
          .trim();
      }
    }
    return result;
  }
}
