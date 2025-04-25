
import { Layout } from "@/components/Layout";

export default function About() {
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 font-mono">About AI Shadow Library</h1>
          
          <div className="neo-blur p-6 mb-8 space-y-4">
            <p>
              AI Shadow Library serves as a central repository for AI research materials, techniques, leaks, 
              and documents that exist in the gray spaces of AI development and deployment.
            </p>
            
            <p>
              Our mission is to preserve knowledge and foster understanding of AI systems through 
              documentation of prompting techniques, system instructions, and methods that reveal 
              capabilities and constraints of large language models.
            </p>
            
            <p className="text-muted-foreground italic">
              This library is intended for educational and research purposes. We do not endorse 
              using these techniques to cause harm or violate terms of service.
            </p>
          </div>
          
          <h2 className="text-xl font-bold mb-4 font-mono">Content Guidelines</h2>
          
          <div className="space-y-4 mb-8">
            <p>
              We accept submissions across several categories:
            </p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-bold">Jailbreaks</span> - Methods to bypass AI safety measures and limitations
              </li>
              <li>
                <span className="font-bold">System Prompts</span> - Prompts used to define AI system behavior
              </li>
              <li>
                <span className="font-bold">Leaked Information</span> - Information about AI models and development
              </li>
              <li>
                <span className="font-bold">Tools</span> - Scripts and software for working with AI models
              </li>
              <li>
                <span className="font-bold">Techniques</span> - Methods for improving AI interactions
              </li>
              <li>
                <span className="font-bold">Documents</span> - Internal and technical documentation
              </li>
            </ul>
            
            <p>
              All submissions are reviewed before publication. We prioritize content that has educational 
              value and provides insights into AI systems.
            </p>
          </div>
          
          <h2 className="text-xl font-bold mb-4 font-mono">Contact</h2>
          
          <div className="mb-8">
            <p>
              For inquiries, feedback, or concerns, you can reach us at: 
              <span className="text-primary ml-1">contact@aishadowlibrary.com</span>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
