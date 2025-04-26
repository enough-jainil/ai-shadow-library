import { Layout } from "@/components/Layout";

export default function Submit() {
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 font-mono">Submit Content</h1>

          <div className="neo-blur p-6 mb-8">
            <p>
              Share your AI discoveries with the community. All submissions are
              reviewed before being published. Your content should be
              educational and provide value to researchers and enthusiasts.
            </p>
          </div>

          <iframe
            src="https://near-crab-64b.notion.site/ebd/1e1c36260c5080908b66fb07bdc89abf"
            width="100%"
            height="600"
            allowFullScreen
            title="Submission Form"
          />
        </div>
      </div>
    </Layout>
  );
}
