import { Text } from '~/components/ui/text';
import AppSafeView from '~/components/shared/AppSafeView';
import { Dimensions, ScrollView, View } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { LinearGradient } from 'expo-linear-gradient';
import { NAV_THEME } from '~/constants/colors';
import { Image } from 'react-native';
import { TagsStyles } from '~/constants/sharedStyles';

const { width } = Dimensions.get('window');

const data = {
	id: 1,
	coverImg: 'https://picsum.photos/200/120',
	category: 'Technology',
	title: 'Exploring the Future of AI in Daily Life',
	description:
		'A deep dive into how AI is transforming everything from transportation to healthcare. A guide to building scalable and resilient apps using cloud-native principles.',
	content: `
		<p>In the final part of our Go observability series, we bring our efforts full circle. With Grafana Alloy, Loki, Tempo, Prometheus, and our Go app running via Docker Compose, it's time to connect the dots in Grafana. We'll log in, configure dashboards, query logs, explore traces, and monitor metrics — all from a single pane of glass. The magic finally happens here.</p>
<h2>A Little Recap</h2>
<p>In <a href="../../blogs/part-1-adding-observability-to-a-go-application" target="_blank" rel="noopener">Part 1</a>, we instrumented our Go application using OpenTelemetry. In <a href="../../blogs/part-2-laying-the-observability-foundation-infrastructure-integration" target="_blank" rel="noopener">Part 2</a>, we built and wired a full observability pipeline using Docker Compose — plugging in <strong>Backend, </strong><strong data-start="889" data-end="916">Prometheus, Loki, Tempo</strong>, and <strong data-start="922" data-end="939">Grafana Alloy</strong>.</p>
<p data-start="942" data-end="1056">Now, in this final part we finally visualize the logs, metrics, and traces we've worked so hard to collect. We'll:</p>
<ul data-start="1058" data-end="1236">
<li data-start="1058" data-end="1076">
<p data-start="1060" data-end="1076">Log into Grafana</p>
</li>
<li data-start="1077" data-end="1128">
<p data-start="1079" data-end="1128">View our datasources (already pre-configured!)</p>
</li>
<li data-start="1129" data-end="1154">
<p data-start="1131" data-end="1154">Build simple dashboards</p>
</li>
<li data-start="1129" data-end="1154">Send request to our backend service(go application) using Postman</li>
<li data-start="1155" data-end="1207">
<p data-start="1157" data-end="1207">View traces, logs, and metrics for our running app</p>
</li>
</ul>
<p data-start="1238" data-end="1297">This is where it all clicks together. Let’s dive in...</p>
<p data-start="1238" data-end="1297">&nbsp;</p>
<h2 data-start="1238" data-end="1297">Logging into Grafana</h2>
<p>With our container all running you go to <code>localhost:3000</code> on your browser. On our docker-compose.yml we set the Password and Username of our root user to <strong>admin</strong>.</p>
<p>And with that we are in.</p>
<figure class="image"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://firebasestorage.googleapis.com/v0/b/react-portfolio-fb429.appspot.com/o/editor-images%2F1752306759868-ilf43friah.png?alt=media&amp;token=a111f757-91cb-4206-8f32-a3347f7cabed" width="1181" height="767">
<figcaption>Grafana Login</figcaption>
</figure>
<h2>Verifying Data Sources</h2>
<p>Go to <strong>Connections &gt; Data Sources, </strong>we will see three data sources already preconfigured</p>
<figure class="image"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://firebasestorage.googleapis.com/v0/b/react-portfolio-fb429.appspot.com/o/editor-images%2F1752306764520-nh2lkebbo8m.png?alt=media&amp;token=7787e26a-d0d8-4e1d-8bac-dcb8db73b01a" width="1047" height="478">
<figcaption>Grafana Data Sources</figcaption>
</figure>
<h2 data-start="1238" data-end="1297">Creating Dashboards</h2>
<p>Now we can start visualizing our telemetry data. But we first need dashboard, go to <strong>Dashboards</strong> and create your first dashboard.</p>
<h3>Metrics (Prometheus)</h3>
<p>We will start by showing our metrics, <strong>Add Visualization</strong></p>
<h4><strong>Steps:</strong></h4>
<ol>
<li style="list-style-type: none;">
<ol>
<li>Choose Prometheus us our Data Source at the edit panel</li>
<li>Choose Visualization to Time Series on the right sidebar</li>
<li>Add 4 more queries to the edit panel - this will represent the system memory stats we want to observe/track&nbsp; (memory_total_alloc, memory_heap_alloc,&nbsp;memory_heap_inuse,&nbsp;memory_stack_inuse,&nbsp;memory_sys)</li>
<li>In each query we can choose between Builder or Code to query our Prometheus, for metric I've chosen Code since there are quite a number of metric we are monitoring (system memory, Granafa alloy CPU - Usage)</li>
<li>So go to the Code and we will write some <strong>PromQL</strong>(Prometheus Query Language), <code>memory_heap_alloc{job="Backend"}</code> and do this to all the queries and replace the metrics we want to observe</li>
<li>We can also rename the <strong>Legends</strong> that will show up on our graph, this can be done by changing the <strong>Legend</strong> under <strong>Options</strong> dropdown menu from <strong>Auto to Custom</strong> and choose a name</li>
</ol>
</li>
</ol>
<p>Now we need to run our queries and on our graph we will have this:</p>
<figure class="image"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://firebasestorage.googleapis.com/v0/b/react-portfolio-fb429.appspot.com/o/editor-images%2F1752306767756-ny4xpfqadup.png?alt=media&amp;token=761c1568-f783-4f4a-a7c1-9bf4aa1dae71" width="1099" height="714">
<figcaption>Edit Metric Dashboard</figcaption>
</figure>
<p>And with that we can visualize our metrics generated from our backend.&nbsp;</p>
<figure class="image"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://firebasestorage.googleapis.com/v0/b/react-portfolio-fb429.appspot.com/o/editor-images%2F1752306771430-icm0f4uh7na.png?alt=media&amp;token=986afcfc-bcc2-416b-a570-c69065dc80f0" width="1178" height="765">
<figcaption>Metric Dashboard</figcaption>
</figure>
<blockquote>
<p>You can go further and customize the line width, color, style, even add theresolds that when reached will trigger some alerts on the right sidebar&nbsp;</p>
</blockquote>
<p>&nbsp;</p>
<h3>Logs (Loki)</h3>
<p>Go back to the Dashboard and add a new Visualization (top right Add &gt; Visualization). For our logs we need an extra step, since there hasn't been any traffic to our server we need to send some request.&nbsp;</p>
<p>I'll open up my Postman and send some request to all endpoints and intentionally send invalid request to the <code>POST /compute</code> to see some errors on our Dashboards</p>
<figure class="image"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://firebasestorage.googleapis.com/v0/b/react-portfolio-fb429.appspot.com/o/editor-images%2F1752306774768-arwlmsi41m.png?alt=media&amp;token=9e430fb3-20ee-4c3e-8f4f-dc0ca00c1b2d" width="1052" height="683">
<figcaption>Postman</figcaption>
</figure>
<p>with that we can go ahead and start editing our Dashboard Panel</p>
<h4>steps:</h4>
<ol>
<li style="list-style-type: none;">
<ol>
<li>Choose Loki as our Data Source from the edit panel</li>
<li>Choose Logs as our Visualization from the right sidebar</li>
<li>Need to adjust the time range</li>
<li>For this I'll use the Builder, choose/filter the labels I've choosen the <strong>Level</strong> to be <strong>INFO</strong> (you can <strong>dynamically set some variables</strong> for a Dashboard and be able to switch between them ie from INFO to ERROR from our main dashboard - outside the scope of this article)</li>
</ol>
</li>
</ol>
<figure class="image"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://firebasestorage.googleapis.com/v0/b/react-portfolio-fb429.appspot.com/o/editor-images%2F1752306778151-eqqc3mid7kf.png?alt=media&amp;token=f7c4b39a-01ce-4d1a-866b-be179adcd8cb" width="1017" height="660">
<figcaption>Edit Logs Dashboard</figcaption>
</figure>
<p>Then we can run our queries and get:</p>
<figure class="image"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://firebasestorage.googleapis.com/v0/b/react-portfolio-fb429.appspot.com/o/editor-images%2F1752306781529-8dgbo48aq3x.png?alt=media&amp;token=f1f70ff5-636e-418c-81c6-6f49e738ee60" width="1151" height="748">
<figcaption>Logs Dashboard</figcaption>
</figure>
<p>From this graph we are able to see the logs generated by our Backend Service, we can see the Level, see our resources(originators), and also have a body that is descriptive with attributes, traceId and so on.&nbsp;</p>
<p>&nbsp;</p>
<h3>Traces (Tempo)</h3>
<p>Go back to the Dashboard and add a new Visualization (top right Add &gt; Visualization).</p>
<h4>steps</h4>
<ol>
<li style="list-style-type: none;">
<ol>
<li>Choose Tempo as our Data Source from the edit panel</li>
<li>Choose Table as our Visualization from the right sidebar</li>
<li>Need to adjust the time range</li>
<li>We then need to just run the query (since we have only one backend sending traces) - but you can play around with the Builder and see what Labels and filters you can apply on the queries.</li>
</ol>
</li>
</ol>
<figure class="image"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://firebasestorage.googleapis.com/v0/b/react-portfolio-fb429.appspot.com/o/editor-images%2F1752309091996-ndd0c4mve8a.png?alt=media&amp;token=55b2282c-1450-4ef6-8abd-b047a9b96903" width="1086" height="705">
<figcaption>Traces Dashboard</figcaption>
</figure>
<p>From our <strong data-start="211" data-end="233">Traces table panel</strong>, we can instantly see all the recent spans emitted by our Go backend — grouped by their trace ID, service, endpoint, and duration. These include calls to <code data-start="388" data-end="397">/health</code>, <code data-start="399" data-end="409">/compute</code>, and <code data-start="415" data-end="432">/compute (POST)</code> endpoints. This gives us a high-level view of what operations were triggered, when, and how long they took.</p>
<p>Clicking on any trace brings us to <strong data-start="626" data-end="658">Grafana Tempo's Explore view</strong>, where we can analyze the full request lifecycle. In one of the POST <code data-start="728" data-end="738">/compute</code> traces, for example, we see two spans: one for the <strong data-start="790" data-end="812">OtelGin middleware</strong> and another for our custom handler <code data-start="848" data-end="860">ComputeTwo</code>.</p>
<figure class="image"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://firebasestorage.googleapis.com/v0/b/react-portfolio-fb429.appspot.com/o/editor-images%2F1752309095944-orqfh9s1yr9.png?alt=media&amp;token=e8ad9f0d-cb03-473c-9c10-4ecdd02b8c9d" width="1236" height="803">
<figcaption>Trace Span</figcaption>
</figure>
<p>This second span even shows an error event, This makes it crystal clear that an invalid input was received — and shows exactly when and where the error occurred in the context of the request timeline.</p>
<figure class="image"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://firebasestorage.googleapis.com/v0/b/react-portfolio-fb429.appspot.com/o/editor-images%2F1752309099409-t41nh2e2ugh.png?alt=media&amp;token=dac00ccc-0614-423f-a959-407413657c2d" width="1221" height="793">
<figcaption>Trace Span</figcaption>
</figure>
<h2>Bringing It All Together</h2>
<figure class="image"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://firebasestorage.googleapis.com/v0/b/react-portfolio-fb429.appspot.com/o/editor-images%2F1752309102769-jdia28a9epr.png?alt=media&amp;token=26a2c665-2374-434b-bd89-516b00659772" width="1121" height="728">
<figcaption>Dashboards</figcaption>
</figure>
<p data-start="167" data-end="619">This is a powerful capability: <strong data-start="1364" data-end="1411">logs, metrics, and traces all tied together</strong>, enabling precise diagnosis without jumping between tools. In real-world scenarios, this tight visibility loop shortens debugging cycles dramatically.</p>
<p data-start="167" data-end="619">With everything running, we now have the full power of observability at our fingertips. You can jump into a log line, trace it back to the exact span that generated it, and quickly pinpoint the source of an error. Visualize how memory is being allocated across time in your backend service, or set up alerts when things go out of bounds. Dashboards can be made dynamic with variables, for instance, toggling between log levels like <code data-start="600" data-end="606">info</code> and <code data-start="611" data-end="618">error</code>.</p>
<p data-start="621" data-end="784">But all of this, advanced correlations, dashboards per signal type, alerting rules — deserves its own deep-dive, which is a bit outside the scope of this article.</p>
<p data-start="621" data-end="784">&nbsp;</p>
<h2 data-start="621" data-end="784">Conclusion</h2>
<p data-start="3017" data-end="3116">We’ve finally come full circle, from <strong data-start="3055" data-end="3074">instrumentation</strong>, to <strong data-start="3079" data-end="3093">collection</strong>, to <strong data-start="3098" data-end="3115">visualization</strong>.&nbsp;With Grafana in place, you can now monitor, debug, and optimize your Go applications confidently using real-time telemetry data. We've come along way&nbsp;from emitting raw telemetry to running a fully observable Go application inside Docker.</p>
<p data-start="3017" data-end="3116">In this final part, we explored how to log into Grafana and connect the dots across metrics, logs, and traces, all thanks to OpenTelemetry and Grafana’s observability stack. What’s powerful here is not just visibility, it’s the ability to <strong data-start="1161" data-end="1175">understand</strong> your system and make <strong data-start="1197" data-end="1219">informed decisions</strong> fast.</p>
<p data-start="3017" data-end="3116">You can find the full implementation here&nbsp;<a href="https://github.com/EmilioCliff/learn-go/tree/master/observability" target="_blank" rel="noopener">Observability</a></p>
<blockquote>
<p data-start="3017" data-end="3116">Stay tuned for a possible bonus post where we build alerts and long-term storage(ie s3 buckets, ClickHouse). But for now — your system is truly observable.</p>
</blockquote>
<p data-start="1227" data-end="1305">Thanks for sticking through this series, until next time</p>
<pre style="text-align: center;" data-start="1227" data-end="1305">stay observable 😅</pre>`,
	readTime: 7,
	datePublished: '2025-07-20',
	featured: false,
	publisher: {
		name: 'Emilio Cliff',
		profileUrl: 'https://i.pravatar.cc/100',
	},
};

export default function Blog() {
	return (
		<AppSafeView>
			<ScrollView
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				className="flex-1 px-4"
			>
				<LinearGradient
					colors={[
						NAV_THEME.kenyaFlag.red.front,
						NAV_THEME.kenyaFlag.green.mid,
					]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					locations={[0, 1]}
					style={{ marginBottom: 14 }}
				>
					<Image
						style={{
							width: '100%',
							height: 300,
							resizeMode: 'cover',
						}}
						source={{ uri: data.coverImg }}
					/>
				</LinearGradient>
				<Text className="text-4xl font-extrabold mb-4">
					{data.title}
				</Text>
				<Text className="mb-2">
					{data.datePublished} · {data.readTime} min Read
				</Text>
				<View className="flex-row justify-start items-center gap-2 mb-2">
					<Avatar alt="Publisher Avatar">
						<AvatarImage
							source={{ uri: data.publisher.profileUrl }}
						/>
						<AvatarFallback>
							<Text>
								{data.publisher.name
									.split(' ')
									.map((word) => word.charAt(0))
									.join('')
									.toUpperCase()}
							</Text>
						</AvatarFallback>
					</Avatar>
					<View>
						<Text className="text-sm font-semibold">
							{data.publisher.name}
						</Text>
						<Text className="text-xs text-gray-500">
							{data.datePublished}
						</Text>
					</View>
				</View>
				<RenderHtml
					contentWidth={width - 32}
					source={{ html: data.content }}
					tagsStyles={TagsStyles}
				/>
			</ScrollView>
		</AppSafeView>
	);
}
