const importItemByContentType = async (id, item) => {
  // Let's get department and region for each item being imported
  const departmentId = await getDepartment(item);
  console.log(departmentId);
  const regionId = await getRegion(item);
  console.log(regionId);

  return strapi
    .query(id)
    .create({ ...item, department: departmentId, region: regionId });
};

// const importItemByContentType = async (id, item) => {
//   // Let's get department and region for each item being imported
//   const departmentId = await getDepartment(item);

//   // console.log(departmentId);
//   const regionId = await getRegion(item);

//   // console.log(regionId);

//   return strapi
//     .query(id)
//     .create({ ...item, department: departmentId, region: regionId });
// };

/** TODO:
 * [] Identify why 'Antioquia' was set as the department for all municipios
 * [] Make sure all new fields are added
 * */
/**
 * The following function should be called when looping through all items being imported
 *
 * @param {*} id Tne model identifier set by Strapi.
 * @param {*} item object to be imported.
 */
const createRelationships = async (id, item) => {
  console.log("id", id);
  console.log("Item ", item);
  // Get Department ID to add it to the 'department' relation within cities
  const departmentId = await getDepartment(item);

  /**
   * This code applies only when the dataset had been already imported
   * 1. Let's query the correct model identified with an id
   * 2. Within the model let's find an object that matches our filter
   *  2.1 municipio matches the current one being imported
   *  2.2. where department was not set
   */
  const currentItem = await strapi
    .query(id)
    .model.findOne({ municipio: item.municipio })
    .where({ department: null });

  if (currentItem !== null) {
    return currentItem
      .update({
        $set: {
          id: item.id,
          // municipio: item.municipio,
          department: departmentId,
          label: item.label,
          shortLabel: item.shortLabel,
        },
      })
      .exec();
  }

  console.log("find without dept", currentItem);

  // return currentItem.model.findOneAndUpdate(
  //   { id: item.id },
  //   { municipio: item.municipio },
  //   { department: departmentId },
  //   { label: item.label },
  //   { shortLabel: item.shortLabel }
  // );
};

// Gets department for current item being imported and returns its db id
const getDepartment = async (item) => {
  const department = await strapi
    .query("application::departments.departments")
    .findOne({ name: item.department });
  return department.id;
};

// Gets region for current item being imported and returns its db id
const getRegion = async (item) => {
  const region = await strapi
    .query("application::regions.regions")
    .findOne({ name: item.region });
  return region.id;
};

const importSingleType = async (uid, item) => {
  const existing = await strapi.query(uid).find({});
  if (existing.length > 0) {
    return strapi.query(uid).update(
      {
        id: existing[0].id,
      },
      item
    );
  } else {
    return strapi.query(uid).create(item);
  }
};

const findAll = (uid) => {
  return strapi.query(uid).find({});
};

const deleteByIds = (uid, ids) => {
  return strapi.query(uid).delete({
    id_in: ids,
  });
};

module.exports = {
  importItemByContentType,
  findAll,
  deleteByIds,
  importSingleType,
};
