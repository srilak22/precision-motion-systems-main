"""Official seed sources for robotics company intelligence collection."""

from dataclasses import dataclass


@dataclass(frozen=True)
class SeedSource:
    name: str
    url: str
    industry: str
    specialization: str
    company_type: str = "Company"
    parent_company: str = ""


SOURCES = [
    SeedSource("ABB Robotics", "https://www.abb.com/", "Industrial Robotics", "Industrial robots and automation", "Business division", "ABB Ltd."),
    SeedSource("FANUC", "https://www.fanuc.eu/", "Industrial Robotics", "Industrial robots, CNC and factory automation"),
    SeedSource("KUKA", "https://www.kuka.com/", "Industrial Robotics", "Industrial robots and automation"),
    SeedSource("Yaskawa", "https://www.yaskawa.com/", "Industrial Robotics", "Industrial robots, motion control and drives"),
    SeedSource("Mitsubishi Electric", "https://www.mitsubishielectric.com/", "Industrial Automation", "Factory automation and industrial robots"),
    SeedSource("Kawasaki Robotics", "https://kawasakirobotics.com/", "Industrial Robotics", "Industrial robots and automation", "Business division", "Kawasaki Heavy Industries, Ltd."),
    SeedSource("Epson Robots", "https://epson.com/robots", "Industrial Robotics", "SCARA and industrial robots", "Business division", "Seiko Epson Corporation"),
    SeedSource("DENSO Robotics", "https://www.densorobotics.com/", "Industrial Robotics", "Industrial and collaborative robots", "Business division", "DENSO Corporation"),
    SeedSource("Stäubli Robotics", "https://www.staubli.com/", "Industrial Robotics", "Industrial robots and automation", "Business division", "Stäubli International AG"),
    SeedSource("Comau", "https://www.comau.com/", "Industrial Robotics", "Industrial robots and automation"),
    SeedSource("Universal Robots", "https://www.universal-robots.com/", "Collaborative Robotics", "Collaborative robot arms"),
    SeedSource("Doosan Robotics", "https://www.doosanrobotics.com/", "Collaborative Robotics", "Collaborative robots"),
    SeedSource("Techman Robot", "https://www.tm-robot.com/", "Collaborative Robotics", "Collaborative robots with vision"),
    SeedSource("OMRON Automation", "https://automation.omron.com/", "Industrial Automation", "Automation systems and robotics", "Business division", "OMRON Corporation"),
    SeedSource("AUBO Robotics", "https://www.aubo-robotics.cn/", "Collaborative Robotics", "Collaborative robot arms"),
    SeedSource("Elite Robots", "https://www.eliterobots.com/", "Collaborative Robotics", "Collaborative and industrial robots"),
    SeedSource("Hanwha Robotics", "https://www.hanwharobotics.com/", "Collaborative Robotics", "Collaborative and industrial robots"),
    SeedSource("JAKA Robotics", "https://www.jaka.com/", "Collaborative Robotics", "Collaborative robots"),
    SeedSource("Franka Robotics", "https://franka.de/", "Collaborative Robotics", "Research and collaborative robot systems"),
    SeedSource("Mecademic", "https://www.mecademic.com/", "Industrial Robotics", "Compact precision industrial robots"),
    SeedSource("Siemens", "https://www.siemens.com/", "Industrial Automation", "Factory automation, control and digital industries"),
    SeedSource("Rockwell Automation", "https://www.rockwellautomation.com/", "Industrial Automation", "Industrial control and automation"),
    SeedSource("Schneider Electric", "https://www.se.com/", "Industrial Automation", "Industrial automation and energy management"),
    SeedSource("Bosch Rexroth", "https://www.boschrexroth.com/", "Industrial Automation", "Drive, control and factory automation"),
    SeedSource("Festo", "https://www.festo.com/", "Industrial Automation", "Pneumatic and electric automation"),
    SeedSource("SICK", "https://www.sick.com/", "Industrial Automation", "Sensors and machine safety"),
    SeedSource("Cognex", "https://www.cognex.com/", "Machine Vision", "Industrial machine vision and identification"),
    SeedSource("KEYENCE", "https://www.keyence.com/", "Industrial Automation", "Sensors, machine vision and measurement"),
    SeedSource("Beckhoff Automation", "https://www.beckhoff.com/", "Industrial Automation", "PC-based control and motion automation"),
    SeedSource("Delta Electronics", "https://www.deltaww.com/", "Industrial Automation", "Industrial automation and power electronics"),
    SeedSource("Boston Dynamics", "https://bostondynamics.com/", "Humanoid Robotics", "Mobile and dynamic robots"),
    SeedSource("Agility Robotics", "https://agilityrobotics.com/", "Humanoid Robotics", "Bipedal mobile robots"),
    SeedSource("Unitree Robotics", "https://www.unitree.com/", "Humanoid Robotics", "Quadruped and humanoid robots"),
    SeedSource("DJI", "https://www.dji.com/", "Drone Robotics", "Uncrewed aerial systems and imaging"),
    SeedSource("iRobot", "https://www.irobot.com/", "Consumer Robotics", "Consumer cleaning robots"),
    SeedSource("ANYbotics", "https://www.anybotics.com/", "Autonomous Mobile Robots", "Autonomous inspection robots"),
    SeedSource("OTTO Motors", "https://ottomotors.com/", "Autonomous Mobile Robots", "Autonomous mobile robots", "Brand", "Rockwell Automation"),
    SeedSource("Locus Robotics", "https://locusrobotics.com/", "Warehouse Automation", "Warehouse autonomous mobile robots"),
    SeedSource("Geek+", "https://www.geekplus.com/", "Warehouse Automation", "Warehouse mobile robotics"),
    SeedSource("Mobile Industrial Robots (MiR)", "https://mobile-industrial-robots.com/", "Autonomous Mobile Robots", "Autonomous mobile robots", "Business division", "Teradyne, Inc."),
    SeedSource("NVIDIA Robotics", "https://www.nvidia.com/en-us/industries/robotics/", "Robotics Software", "Robotics computing, simulation and AI", "Business division", "NVIDIA Corporation"),
    SeedSource("ROS", "https://www.ros.org/", "Research and Education", "Open-source robot software ecosystem", "Open-source project"),
    SeedSource("RoboDK", "https://robodk.com/", "Robotics Software", "Robot simulation and offline programming"),
    SeedSource("PickNik Robotics", "https://picknik.ai/", "Robotics Software", "Robot software and motion planning"),
    SeedSource("Clearpath Robotics", "https://clearpathrobotics.com/", "Autonomous Mobile Robots", "Mobile robot platforms", "Business division", "Rockwell Automation"),
    SeedSource("Schunk", "https://schunk.com/", "Robotics Components", "Gripping systems and toolholding"),
    SeedSource("Zimmer Group", "https://www.zimmer-group.com/", "Robotics Components", "Grippers and automation components"),
    SeedSource("OnRobot", "https://onrobot.com/", "Robotics Components", "End-of-arm tooling and grippers"),
    SeedSource("ATI Industrial Automation", "https://ati-ia.com/", "Robotics Components", "Robotic tool changers and force/torque sensing"),
    SeedSource("Robotiq", "https://robotiq.com/", "Robotics Components", "Grippers and collaborative robot tooling"),
]