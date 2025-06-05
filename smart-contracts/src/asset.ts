/*
  SPDX-License-Identifier: Apache-2.0
*/

import { Object, Property } from "fabric-contract-api";

export interface GeneralSubjects {
  name: string;
  credits: number;
  grade: string;
}

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
  @Property()
  public ID: string = ""; // trx_id

  @Property()
  public docType?: string;

  @Property()
  public IssueDate: string = ""; // verify date

  @Property()
  public Issuer: string = ""; // who verify that certificate

  @Property()
  public OwnerId: string = "";

  @Property()
  public DocHash: string = ""; // document footprint from the original doc or from

  @Property()
  public Doc_URL: string = "";

  @Property()
  public DocSignature: string = "";

  @Property()
  public Status?: string = "approved"; // status of the issue approved, revoked

  @Property()
  public MetaData: StudentMeta[] = []; // student information

  @Property()
  public GeneralSubject: GeneralSubjects[] = [];
}
