var solar_heating_convection = {
  "model": {
    "solar_power_density": "50000.0",
    "viewupdate_interval": "10",
    "structure": {
      "part": [
        {
          "specific_heat": "1300.0",
          "emissivity": "0.0",
          "reflection": "1.0",
          "polygon": {
            "vertices": "8.0, 8.0, 8.5, 8.0, 8.5, 7.0, 8.0, 7.0",
            "count": "4"
          },
          "color": "22ccff",
          "constant_temperature": "false",
          "transmission": "0.0",
          "absorption": "1.0",
          "temperature": "0.0",
          "thermal_conductivity": "0.08",
          "density": "25.0"
        },
        {
          "specific_heat": "1300.0",
          "emissivity": "0.0",
          "reflection": "1.0",
          "rectangle": {
            "x": "2.0",
            "y": "7.0",
            "height": "1.0",
            "width": "0.5"
          },
          "constant_temperature": "false",
          "transmission": "0.0",
          "absorption": "1.0",
          "temperature": "0.0",
          "thermal_conductivity": "0.0010",
          "density": "25.0"
        },
        {
          "specific_heat": "1300.0",
          "emissivity": "0.0",
          "reflection": "1.0",
          "rectangle": {
            "x": "2.0",
            "y": "3.5",
            "height": "1.5",
            "width": "0.5"
          },
          "constant_temperature": "false",
          "transmission": "0.0",
          "absorption": "1.0",
          "temperature": "0.0",
          "thermal_conductivity": "0.0010",
          "density": "25.0"
        },
        {
          "label": "Roof",
          "specific_heat": "1300.0",
          "emissivity": "0.0",
          "reflection": "1.0",
          "polygon": {
            "vertices": "1.5, 3.5, 5.5, 1.0, 9.5, 3.5, 8.5, 3.5, 5.5, 1.6499996, 2.5, 3.5",
            "count": "6"
          },
          "constant_temperature": "false",
          "transmission": "0.0",
          "absorption": "1.0",
          "temperature": "0.0",
          "thermal_conductivity": "0.0010",
          "density": "25.0"
        },
        {
          "label": "Ground",
          "specific_heat": "1300.0",
          "emissivity": "0.0",
          "reflection": "1.0",
          "rectangle": {
            "x": "-0.099999905",
            "y": "8.0",
            "height": "2.0",
            "width": "10.2"
          },
          "color": "333333",
          "constant_temperature": "false",
          "transmission": "0.0",
          "absorption": "1.0",
          "temperature": "0.0",
          "thermal_conductivity": "0.0010",
          "density": "25.0"
        },
        {
          "label": "Wall",
          "specific_heat": "1300.0",
          "emissivity": "0.0",
          "reflection": "1.0",
          "rectangle": {
            "x": "8.5",
            "y": "3.5",
            "height": "4.5",
            "width": "0.5"
          },
          "constant_temperature": "false",
          "transmission": "0.0",
          "absorption": "1.0",
          "temperature": "0.0",
          "thermal_conductivity": "0.0010",
          "density": "25.0"
        },
        {
          "label": "Window",
          "specific_heat": "1300.0",
          "emissivity": "0.0",
          "reflection": "0.0",
          "rectangle": {
            "x": "2.15",
            "y": "5.0",
            "height": "2.0",
            "width": "0.2"
          },
          "color": "ccccff",
          "constant_temperature": "false",
          "transmission": "1.0",
          "absorption": "0.0",
          "temperature": "0.0",
          "thermal_conductivity": "0.0010",
          "density": "25.0"
        },
        {
          "label": "Ceiling",
          "specific_heat": "1300.0",
          "emissivity": "0.0",
          "reflection": "1.0",
          "rectangle": {
            "x": "2.5",
            "y": "3.5",
            "height": "0.5",
            "width": "6.0"
          },
          "constant_temperature": "false",
          "transmission": "0.0",
          "absorption": "1.0",
          "temperature": "0.0",
          "thermal_conductivity": "0.0010",
          "density": "25.0"
        },
        {
          "label": "Floor",
          "specific_heat": "1300.0",
          "emissivity": "0.0",
          "reflection": "0.0",
          "rectangle": {
            "x": "2.55",
            "y": "7.7",
            "height": "0.25",
            "width": "5.9"
          },
          "color": "444444",
          "constant_temperature": "false",
          "transmission": "0.0",
          "absorption": "1.0",
          "temperature": "0.0",
          "thermal_conductivity": "0.08",
          "density": "25.0"
        }
      ]
    },
    "buoyancy_approximation": "0",
    "background_viscosity": "0.01",
    "solar_ray_speed": "0.04",
    "sun_angle": "2.6179938",
    "boundary": {
      "temperature_at_border": {
        "left": "0.0",
        "lower": "0.0",
        "upper": "0.0",
        "right": "0.0"
      }
    },
    "background_conductivity": "1.0",
    "sunny": "true",
    "photon_emission_interval": "5",
    "solar_ray_count": "48",
    "thermal_buoyancy": "2.5E-4",
    "measurement_interval": "100"
  },
  "view": {
    "rainbow_h": "0.0",
    "ruler": "true",
    "maximum_temperature": "40.0",
    "text": {
      "name": "Arial",
      "size": "14",
      "x": "0.5",
      "y": "9.5",
      "color": "ffffff",
      "string": "Press 'Q' or 'W' to change the sun angle",
      "style": "0"
    },
    "minimum_temperature": "0.0",
    "rainbow_w": "0.0",
    "rainbow_x": "0.0",
    "rainbow_y": "0.0"
  },
  "sensor": {
    "thermometer": [
      {
        "x": "1.625",
        "y": "6.25"
      },
      {
        "x": "5.125",
        "y": "6.25"
      },
      {
        "x": "6.125",
        "y": "6.25"
      }
    ]
  }
};