import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../i18n/LanguageContext";

const PrivacyPolicy = () => {
  const { t } = useLanguage();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#05051a] text-white font-['Be_Vietnam_Pro'] selection:bg-[#FF00FF]/30">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="font-['Epilogue'] text-4xl lg:text-6xl font-extrabold uppercase tracking-tight mb-4">
              {t("privacy_policy").split(" ")[0]} <span className="text-[#FF00FF]">{t("privacy_policy").split(" ").slice(1).join(" ") || ""}</span>
            </h1>
            <div className="w-20 h-1.5 bg-[#FF00FF] mx-auto rounded-full"></div>
          </div>

          {/* Content Card */}
          <div className="glass-card rounded-3xl p-8 lg:p-12 border border-white/10 bg-white/[0.02] backdrop-blur-xl space-y-10 leading-relaxed text-white/80">
            
            <div className="space-y-6">
              <h2 className="text-white text-2xl font-bold uppercase tracking-widest border-b border-white/10 pb-4">Privacy Policy for Pascha Salzburg</h2>
              <div className="space-y-4">
                <p className="font-bold text-white">Foreword</p>
                <p>We take the protection of your personal data seriously. Special attention to privacy when processing personal data is of utmost importance to us. Personal data is used in accordance with the provisions of the German Federal Data Protection Act (BDSG). The operators of this website are committed to confidentiality. This website may contain links to websites of other providers to which this privacy policy does not apply. Further important information can also be found in the Terms of Use.</p>
              </div>
            </div>

            <section className="space-y-4">
              <h3 className="text-white text-xl font-bold">Personal data</h3>
              <p>Personal data is information that can be used to identify an individual. This includes information such as real name, address, postal address, and telephone number. Information that is not directly linked to a person's real identity (such as favorite websites or the number of users on a site) is not considered personal data.</p>
              <p>You can generally use our online services without disclosing your identity. If you choose to register, i.e., sign up as a member (registered user), you can store personal information in your individual user profile. It is entirely up to you whether or not you enter this data. Since we strive to collect as little personal data as possible for using our services, registration only requires a username – under which you will be listed as a member and which does not have to match your real name – and your email address, to which your password will be sent. When you access our pages, data (such as IP address, date, time, and pages viewed) is stored on our servers. This data is not used to identify you personally. We reserve the right to perform statistical analysis of anonymized data sets.</p>
              <p>We use personal data for the purposes of technical administration of the websites and customer management only to the extent necessary in each case. Furthermore, personal data is only stored if it is provided voluntarily.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-white text-xl font-bold">Disclosure of personal data</h3>
              <p>We use personal information only for this website. We do not share this information with third parties without your explicit consent. If data is transferred to service providers as part of order processing, these providers are bound by the German Federal Data Protection Act (BDSG), other legal regulations, and this Privacy Policy.</p>
              <p>Personal data is collected or transmitted to government institutions and authorities only within the framework of mandatory legal regulations.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-white text-xl font-bold">Use of cookies</h3>
              <p>We use cookies – small files containing configuration information. They help us determine user-specific settings and implement special user functions. We do not collect any personal data via cookies. All website functions can also be used without cookies, however, some user-defined features and settings will then be unavailable.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-white text-xl font-bold">Children</h3>
              <p>Individuals under the age of 18 should not submit any personal data to us without the consent of their parents or legal guardians. We do not request, collect, or share personal data from children with third parties.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-white text-xl font-bold">Right of withdrawal</h3>
              <p>If you have provided us with personal data, you can change or delete it at any time in your user profile. For complete account deletion, please contact the webmaster. However, contributions made up to that point in forums, comments, event announcements, and articles may remain – see the general terms of use for more information.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-white text-xl font-bold">Links to other websites</h3>
              <p>Our website contains links to other websites. We have no control over whether their operators comply with data protection regulations.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-white text-xl font-bold">Posts</h3>
              <p>The posts on our site are accessible to everyone. Before posting, please carefully check your contributions to ensure they do not contain information that is not intended for public viewing. Posts may be indexed by search engines and accessible worldwide, even without directly visiting this website.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-white text-xl font-bold">Questions and comments</h3>
              <p>For questions, suggestions and comments regarding data protection, please contact the webmaster of Pascha Salzburg by email.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-white text-xl font-bold">Right to information</h3>
              <p>You have the right to request information at any time about the data stored concerning you, its origin and recipients, as well as the purpose of the data processing. The webmaster can provide information about the stored data.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-white text-xl font-bold">Safety notice</h3>
              <p>We strive to protect your personal data by taking all available technical and organizational measures to ensure it is inaccessible to third parties. However, we cannot guarantee complete data security when communicating via email, so we recommend using postal mail for confidential information.</p>
            </section>

            <div className="pt-10 border-t border-white/10 space-y-8">
              <h2 className="text-white text-2xl font-bold uppercase tracking-widest">Disclaimer for Pascha Salzburg</h2>
              
              <section className="space-y-4">
                <h3 className="text-white text-xl font-bold">1. Content of the online offer</h3>
                <p>The author assumes no liability for the timeliness, accuracy, completeness, or quality of the information provided. Liability claims against the author relating to material or immaterial damages caused by the use or non-use of the information provided, or by the use of incorrect or incomplete information, are generally excluded, unless the author can be proven to have acted with intent or gross negligence.</p>
                <p>All offers are subject to change and non-binding. The author expressly reserves the right to change, supplement, or delete parts of the pages or the entire offer without prior notice, or to temporarily or permanently discontinue publication.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-white text-xl font-bold">2. References and links</h3>
                <p>In the case of direct or indirect references to external websites ("hyperlinks") that are outside the author's area of responsibility, liability would only apply if the author had knowledge of the content and it was technically possible and reasonable for him to prevent its use in the case of illegal content.</p>
                <p>The author hereby expressly declares that no illegal content was identifiable on the linked pages at the time the links were created. The author has no influence whatsoever on the current or future design, content, or authorship of the linked pages. Therefore, the author expressly disassociates himself from all content on all linked pages that were changed after the links were created. This statement applies to all links and references within the author's own website, as well as to entries made by third parties in guestbooks, discussion forums, link directories, mailing lists, and all other forms of databases set up by the author where external write access is possible. The provider of the linked page, not the party merely providing the link, is solely liable for illegal, incorrect, or incomplete content and, in particular, for damages resulting from the use or non-use of such information.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-white text-xl font-bold">3. Copyright and Trademark Law</h3>
                <p>The author strives to respect the copyrights of all images, graphics, sound documents, video sequences and texts used in all publications, to use images, graphics, sound documents, video sequences and texts created by himself, or to use license-free graphics, sound documents, video sequences and texts.</p>
                <p>All trademarks and brands mentioned within this website and possibly protected by third parties are subject without restriction to the provisions of the applicable trademark law and the ownership rights of the respective registered owners. The mere mention of a trademark does not imply that it is not protected by third-party rights!</p>
                <p>The copyright for published material created by the author remains solely with the author of the pages. Reproduction or use of such graphics, audio recordings, video sequences, and texts in other electronic or printed publications is not permitted without the author's express consent.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-white text-xl font-bold">4. Data protection</h3>
                <p>If the opportunity to enter personal or business data (email addresses, names, addresses) is provided within this website, the disclosure of this data by the user is expressly voluntary. The use and payment of all offered services is permitted – insofar as technically possible and reasonable – even without providing such data, or by providing anonymized data or a pseudonym. The use of contact information published within the legal notice or similar sections, such as postal addresses, telephone and fax numbers, and email addresses, by third parties for sending unsolicited information is prohibited. We expressly reserve the right to take legal action against senders of so-called spam emails who violate this prohibition.</p>
                <p>For further information, please refer to the privacy policy.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-white text-xl font-bold">5. Legal validity of this disclaimer</h3>
                <p>This disclaimer is to be regarded as part of the internet publication from which you were referred to this page. If sections or individual terms of this statement are not legal or correct, the content or validity of the other parts remain unaffected.</p>
                <p>Despite careful review of content, we assume no liability for the content of external links. The operators of the linked websites are solely responsible for their content. All names, terms, symbols, and graphics used here may be trademarks or registered trademarks owned by their respective legal owners. All rights to the mentioned and used trademarks and registered trademarks belong exclusively to their owners.</p>
              </section>
            </div>

            <div className="pt-12 text-center border-t border-white/5">
              <Link to="/" className="inline-flex items-center gap-2 text-[#FF00FF] font-bold uppercase tracking-widest hover:text-white transition-colors group">
                <span className="group-hover:-translate-x-1 transition-transform">←</span> {t("back_to_home")}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
