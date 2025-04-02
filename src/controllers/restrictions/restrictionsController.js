import { Lab } from "../../models/labs.js";
import { RestrictionLab } from "../../models/restrictions.js";

// Controlador encargado de mostrar todas las restricciones de los laboratorios
export const getRestrictions = async (req, res) => {
  try {
    const restrictionslabs = await RestrictionLab.findAll({
      attributes: [
        "id",
        "labId",
        "max_groups",
        "min_group_size",
        "max_group_size",
        "description",
      ],
    });

    return res.status(200).json(restrictionslabs);
  } catch (error) {
    console.log(
      `¡Oops! Las restricciones de laboratorios están jugando al escondite. ¡Vuelve a intentarlo pronto! ${error}`
    );

    return res
      .status(500)
      .json(
        "¡Oops! Las restricciones de laboratorios están jugando al escondite. ¡Vuelve a intentarlo pronto!"
      );
  }
};

// Controlador encargado de registrar las restricciones de los laboratorios
export const registerRestrictions = async (req, res) => {
  try {
    const { idLab } = req.params;

    const searchlab = await Lab.findByPk(idLab);
    if (!searchlab) {
      return res.status(400).json({
        error:
          "¡Lo sentimos! No hemos podido encontrar al laboratorio que intentas crear las restricciones.",
      });
    }

    const searchrestriction = await RestrictionLab.findOne({
      where: { labId: idLab },
    });

    if (searchrestriction)
      return res.status(400).json({
        error: "Oops. Este laboratorio ya cuenta con las restriciones creadas.",
      });

    const { max_groups, min_group_size, max_group_size, description } =
      req.body;

    await RestrictionLab.create({
      labId: idLab,
      max_groups,
      min_group_size,
      max_group_size,
      description,
    });

    return res.status(200).json({
      message:
        "¡Genial! Restricciones del laboratorio ha sido registradas exitosamente.",
    });
  } catch (error) {
    console.error(
      `¡Vaya! Parece que el registro decidió tomarse un descanso. ¿Podrías intentarlo más tarde?. ${error}`
    );

    return res.status(500).json({
      error:
        "¡Vaya! Parece que el registro decidió tomarse un descanso. ¿Podrías intentarlo más tarde?",
    });
  }
};

// Controlador encargado de actualizar las restricciones de los laboratorios
export const updateRestrictions = async (req, res) => {
  try {
    const { idRestriction } = req.params;

    const restriction = await RestrictionLab.findByPk(idRestriction);

    if (!restriction)
      return res.status(400).json({
        error:
          "¡Lo sentimos! No hemos podido encontrar las restricciones del laboratorio que intentas actualizar.",
      });

    const { max_groups, min_group_size, max_group_size, description } =
      req.body;

    //Validación encargada de verificar que el usuario si envie un campo para actualizar y no un objeto vacio
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error:
          "Lo sentimos, no hemos detectado datos para actualizar. Asegúrate de completar los campos necesarios.",
      });
    }

    if (max_groups && max_groups != restriction.max_groups)
      restriction.max_groups = max_groups;
    if (min_group_size && min_group_size != restriction.min_group_size)
      restriction.min_group_size = min_group_size;
    if (max_group_size && max_group_size != restriction.max_group_size)
      restriction.max_group_size = max_group_size;
    if (description && description != restriction.description)
      restriction.description = description;

    await restriction.update({
      max_groups,
      min_group_size,
      max_group_size,
      description,
    });

    return res.status(200).json({
      message:
        "¡Misión cumplida! Los datos de las restricciones del laboratorio han sido actualizados con exito.",
    });
  } catch (error) {
    console.error(
      `No pudimos actualizar los datos. Estamos resolviendo el problema lo antes posible. ${error}`
    );

    return res.status(500).json({
      error:
        "No pudimos actualizar los datos. Estamos resolviendo el problema lo antes posible.",
    });
  }
};

// Controlador encargado de eliminar las restricciones de los laboratorios
export const deleteRestrictions = async (req, res) => {
  try {
    const { idRestriction } = req.params;

    const restriction = await RestrictionLab.findByPk(idRestriction);

    if (!restriction)
      return res.status(400).json({
        error:
          "¡Lo sentimos! No hemos podido encontrar las restricciones del laboratorio que intentas eliminar.",
      });

    await restriction.destroy();

    return res.status(200).json({
      message:
        "¡Misión cumplida! Los datos de las restricciones del laboratorio han sido eliminados con exito.",
    });
  } catch (error) {
    console.error(
      `Lo sentimos, no hemos podido eliminar los datos de las restricciones del laboratorio en este momento. ${error}`
    );

    return res.status(500).json({
      error:
        "Lo sentimos, no hemos podido eliminar los datos de las restricciones del laboratorio en este momento.",
    });
  }
};

// Controlador encargado de mostrar una restriccion de un laboratorio por ID
export const getRestriction = async (req, res) => {
  try {
    const { idRestriction } = req.params;
    const restriction = await RestrictionLab.findByPk(idRestriction, {
      attributes: [
        "id",
        "labId",
        "max_groups",
        "min_group_size",
        "max_group_size",
        "description",
      ],
    });

    if (!restriction)
      return res.status(400).json({
        error:
          "¡Lo sentimos! No hemos podido encontrar la restricción del laboratorio.",
      });

    return res.status(200).json(restriction);
  } catch (error) {
    console.error(
      `Lo sentimos, no hemos podido encontrar la restricción del laboratorio en este momento. ${error}`
    );

    return res.status(500).json({
      error:
        "Lo sentimos, no hemos podido encontrar la restricción del laboratorio en este momento.",
    });
  }
};
