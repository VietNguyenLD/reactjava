import * as api from '../network/ApiService';
export const API_ZONE = "v1/zone";

/*------------------------------RETURN----------------------------------------*/
export const fetchZoneSuccess = (data) => {
  return {
    type: 'LIST_ZONE',
    data
  };
};

export const fetchZoneByIdSuccess = (itembyid) => {
  return {
    type: 'EDIT_ZONE',
    itembyid
  };
};

export const createZoneSuccess = (itemadd) => {
  return {
    type: 'ADD_ZONE',
    itemadd
  };
};

export const updateZoneSuccess = (itemupdate) => {
  return {
    type: "UPDATE_ZONE",
    itemupdate
  };
};

/*------------------------------FETCH----------------------------------------*/
export const fetchZone = (params) => {  
  return (dispatch) => {
    api.getAll(API_ZONE, params, function(response) {
      dispatch(fetchZoneSuccess(response.data))
    });
  };
};

export const fetchZoneById = (id, params) => {
  return (dispatch) => {
    api.getOne(API_ZONE, id, params, function(response) {
      dispatch(fetchZoneByIdSuccess(response.data))
    });
  };
};

export const createZone = (params) => {
  return (dispatch) => {
    api.create(API_ZONE, params, function(response) {
      dispatch(createZoneSuccess(response.data))
    });
  };
};

export const upddateZone = (id, params) => {
  return (dispatch) => {
    api.update(API_ZONE, id, params, function(response) {
      dispatch(updateZoneSuccess(response.data))
    });
  };
};

export const setZoneName = zone_name => (dispatch, getState) => {
  dispatch({
      type: 'SET_ZONE_NAME',
      zone_name,
  })
}

export const setPublished = published => (dispatch, getState) => {
  dispatch({
      type: 'SET_PUBLISHED',
      published,
  })
}
