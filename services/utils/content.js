// Default: Normal imports
const importItemByContentType = async (id, item) => {
  // If importing departments
  if (id === "application::departments.departments") {
    const deptRegionRelationship = await processDepartments(id, item);
    return deptRegionRelationship;
  } else if (id === "application::cities.cities") {
    // when importing cities
    const cities = processCities(id, item);
    return cities;
  }
  // Normal collections
  return strapi.query(id).create(item);
};

// When Importing departments. Department: strapi-departments-regions.json (name, region)
const processDepartments = async (id, item) => {
  const region = await getRegion(item);
  console.log(`%cAssigning ${region.name} to ${item.name}`, "color: green");

  return strapi.query(id).create({
    ...item,
    region: region.id,
  });
};

// When importing Cities
const processCities = async (id, item) => {
  // Let's get department and region for each item being imported
  const department = await getDepartment(item);
  const region = await getRegion(item);
  console.log(
    `%cAssigning Department: ${department.name} and ${region.name} to ${item.shortLabel}`,
    "color: green"
  );

  return strapi
    .query(id)
    .create({ ...item, department: department.id, region: region.id });
};

// Gets department for current item being imported and returns its db id
const getDepartment = async (item) => {
  const department = await strapi
    .query("application::departments.departments")
    .findOne({ name: item.department });

  return department;
};

// Gets region for current item being imported and returns its db id
const getRegion = async (item) => {
  const region = await strapi
    .query("application::regions.regions")
    .findOne({ name: item.region });

  return region;
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
