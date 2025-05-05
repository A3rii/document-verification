/*
  SPDX-License-Identifier: Apache-2.0
*/

import { Object } from "fabric-contract-api";

export interface StudentMeta {
  name: string;
  sex: string;
  dob: string;
  major: string;
  gpa: number;
  overall_grade: string;
}

@Object()
export class Asset {
  public ID: string = ""; // trx_id

  public docType?: string;

  public IssueDate: string = ""; // verify date

  public Issuer: string = ""; // who verify that certificate

  public OwnerId: string = "";

  public DocHash: string = ""; // document footprint from the original doc or from IPFS

  public Status?: string = "approved"; // status of the issue approved, revoked

  public MetaData: StudentMeta[] = []; // student information
}
