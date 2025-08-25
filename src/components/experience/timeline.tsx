import { Experience, ExperienceTimeLine } from "@/data/types.data"
import { motion } from "framer-motion"
import { Calendar, MapPin, Briefcase } from "lucide-react"

interface ExperienceProjectsProps {
  experience: Experience
}

const Timeline = ({ experience }: ExperienceProjectsProps) => {
  return (
    <div className="relative">
      {/* Animated background line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-blue-500 to-purple-500 opacity-30" />
      
      {/* Main timeline */}
      <div className="relative space-y-12">
        {experience.experience_time_line.map((exp: ExperienceTimeLine, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            className="relative flex items-start group"
          >
            {/* Animated dot with glow effect */}
            <div className="relative z-10 flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.2 }}
                className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full border-4 border-gray-900 flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300"
              >
                <Briefcase className="w-5 h-5 text-white" />
              </motion.div>
              
              {/* Connecting line to next item */}
              {i < experience.experience_time_line.length - 1 && (
                <div className="absolute top-12 left-6 w-0.5 h-12 bg-gradient-to-b from-emerald-500/50 to-transparent" />
              )}
            </div>

            {/* Content card */}
            <motion.div
              whileHover={{ y: -2 }}
              className="ml-6 flex-1 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-emerald-500/10"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  {exp.position}
                </h3>
                <div className="flex items-center text-sm text-gray-400 bg-gray-700/50 rounded-full px-3 py-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(exp.start_date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  –{" "}
                  {exp.end_date
                    ? new Date(exp.end_date).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : "Present"}
                </div>
              </div>
              
              {/* Add company info if available */}
              {experience.company_name && (
                <div className="flex items-center text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-emerald-400" />
                  <span className="font-medium">{experience.company_name}</span>
                </div>
              )}
              
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Timeline
