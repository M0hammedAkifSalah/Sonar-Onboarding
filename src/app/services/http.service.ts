import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  reqHeaders: any = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'token': `${localStorage.getItem('token')}`
  });

  API = environment.API_URL;
  constructor(private http: HttpClient) { }

  //Login
  login(data: any) {
    return this.http.post(`${this.API}/SignUp/login`, data)
  }

  // Get Country
  getCountry() {
    return this.http.get(`${this.API}/country`)
  }
  // Get States
  getStates() {
    return this.http.get(`${this.API}/state`)
  }

  getClasses() {
    // return this.http.get(`${this.API}/class?repository.repository_type=Global`)
    return this.http.get(`${this.API}/class?repository.repository_type=Global&page=1&limit=50`)
  }

  getSubjects() {
    // return this.http.get(`${this.API}/subject?repository.repository_type=Global`)
    return this.http.get(`${this.API}/subject/getAllSubject?repository.repository_type=Global`)
  }

  getCities() {
    return this.http.get(`${this.API}/city?limit=3000`)
  }

  register(data: any, id: any) {

    return this.http.put(`${this.API}/school/newapi/updateschool/${id}`, data)
  }
  regAdmin(data: any) {
    return this.http.post(`${this.API}/signUp`, data)
  }
  getBoards() {
    return this.http.get(`${this.API}/board?repository.repository_type=Global`)
  }
  getSyllabus() {
    return this.http.get(`${this.API}/syllabus?repository.repository_type=Global`)
  }
  addClasses(id: any, data: any) {
    let apiUrl = `${this.API}/school/${id}`
    console.log('its Here', data)
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' })
  }
  addSection(data: any) {
    return this.http.post(`${this.API}/section`, data)
  }
  addBoard(id: any, data: any) {
    let apiUrl = `${this.API}/board?_id=${id}`
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' })
  }
  addSyllabus(id: any, data: any) {
    let apiUrl = `${this.API}/syllabus?_id=${id}`
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' })
  }
  addSubject(id: any, data: any) {
    return this.http.put(`${this.API}/subject?_id=${id}`, data)
  }
  mapBoard(id: any, data: any) {
    return this.http.put(`${this.API}/board/byschool/${id}`, data)
  }
  mapSubject(id: any, data: any) {
    return this.http.put(`${this.API}/subject/byschool/${id}`, data)
  }
  mapSubjects(data: any) {
    return this.http.put(`${this.API}/subject/mapMany`, data)
  }

  getSchool(id: any) {
    return this.http.get(`${this.API}/school/${id}`)
  }
  getSection(id: any) {
    return this.http.get(`${this.API}/section?repository.id=${id}`)
  }

  signUp(data: any) {
    return this.http.post(`${this.API}/school/newapi/create/addschool`, data)
  }
  bulkUpload(students: any) {
    return this.http.post(`${this.API}/student/createManyStudent/`, students)
  }
  bulkUploadTeachers(teachers: any) {
    return this.http.post(`${this.API}/signup/createMany`, teachers)
  }

  uploadFile(data: any) {
    /*   let reqHdrs = new HttpHeaders({
        'token': this.reqHeaders.token
      }); */
    const apiUrl = `${this.API}/file/upload`;
    return this.http.post(apiUrl, data);
  }

  //Load Schools
  getSchools() {
    return this.http.get(`${this.API}/school/newapi/getschool`)
  }

  //Get Teachers
  getTeachers(id: number, page: number, limit: number) {
    let data = {
      "searchValue": "", "filterKeysArray": ["name", "username", "gender", "branch_id"], "flag": 'teacher', "school_id": id
    }
    return this.http.post(`${this.API}/SignUp/userByRole?school_id=${id}&page=${page}&limit=${limit}`, data)
  }
  getStudentbyClass(id: number, limit: number, classid: any) {
    return this.http.post(`${this.API}/student/byschool/${id}/1/${limit}`, { class: classid })
  }
  getStudentbySearch(id: any, search: any) {
    return this.http.post(`${this.API}/student/byschool/${id}/1/5`, { "searchValue": search, "filterKeysArray": ["name", "username"], "school_id": id })
  }
  getUsersbySearch(id: any, search: any) {
    return this.http.post(`${this.API}/SignUp/userByRole`, { "searchValue": search, "filterKeysArray": ["name", "username"], "school_id": id })
  }

  getInstitutions() {
    return this.http.get(`${this.API}/institute/`)
  }
  createInstitute(data: any) {
    return this.http.post(`${this.API}/institute/create`, data)
  }
  delete(id: any) {
    return this.http.delete(`${this.API}/institute/delete/${id}`)
  }
  update(data: any) {
    return this.http.post(`${this.API}/institute/updateInstitute`, data)
  }
  getInstitute(id: any) {
    return this.http.get(`${this.API}/institute/`)
  }

  mapInstitution(data: any) {
    return this.http.post(`${this.API}/institute/updateSchoolList`, data)
  }

  removeInstution(id: any, data: any) {
    return this.http.post(`${this.API}/institute/removeSchool/${id}`, data)
  }

  createBranch(data: any) {
    return this.http.post(`${this.API}/branch`, data)
  }

  updateBranch(id: any, data: any) {
    return this.http.put(`${this.API}/branch/${id}`, data)
  }


  deactivateSchool(data: any) {
    return this.http.post(`${this.API}/school/updateActiveStatus`, data)
  }

  getAllUsers(code: number) {
    return this.http.get(`${this.API}/SignUp/getAllUsers?school_code=${code}`)
  }

  getStudentsCount(id: string) {
    return this.http.get(`${this.API}/dashboard/stats/student/gendercount?school_id=${id}`)
  }
}
